package db

import "strings"

type Folder struct {
	ID       uint64 `gorm:"primaryKey" json:"folderID"`
	Name     string `gorm:"non null" json:"name"`
	Path     string `gorm:"non null" json:"path"`
	Owner    int64  `gorm:"non null" json:"owner"`
	ParentID uint64 `json:"parentID"`
}

type Tree struct {
	Root    *Folder `json:"root"`
	Files   []*File `json:"files"`
	Folders []*Tree `json:"folders"`
}

func (f *Folder) GetParent() (*Folder, error) { return GetFolderByID(f.ParentID, f.Owner) }

// Act like `mkdir -p`
func CreateFolder(f *Folder) error {
	// If we have a name and a parent
	if f.Name != "" {
		parent, err := f.GetParent()
		if err != nil {
			return err
		}
		// Get folders in parent
		folders, err := GetFoldersInFolder(parent)
		if err != nil {
			return err
		}

		// Check if we already have a folder with that name
		for _, folder := range folders {
			// If so, we set f to the complete folder and return
			if folder.Name == f.Name {
				*f = *folder
				return nil
			}
		}

		// If not we construct a path and register f in the database
		// We could use calculatePath() here but we already made all the queries
		f.Path = parent.Path + "/" + f.Name
		err = sanitizePath(&f.Path)
		if err != nil {
			return err
		}
		return getDB().Create(f).Error
	}

	// If we just have a path, instead
	if f.Path != "" {
		err := sanitizePath(&f.Path)
		if err != nil {
			return err
		}
		// We split the dirs names
		dirs := strings.Split(f.Path, "/")
		// Set the path to the root and get the first parent
		path := "/"
		current, err := GetFolderByPath(path, f.Owner)
		if err != nil {
			return err
		}

		// Loop over the folders
		for _, dir := range dirs {
			if dir == "" {
				continue
			}
			// Get all the folders inside parent
			folders, err := GetFoldersInFolder(current)
			if err != nil {
				return err
			}

			// We loop over the children
			found := false
			for _, folder := range folders {
				// If we find the one we are looking for
				// we set it as the parent and continue
				if folder.Name == dir {
					path += dir + "/"
					current = folder
					found = true
					break
				}
			}

			// If it was not found we create it
			if !found {
				folder := &Folder{
					Name:     dir,
					ParentID: current.ID,
					Owner:    f.Owner,
				}

				// This calls the other branch of this function
				// since we have a name and a complete parent
				err = CreateFolder(folder)
				if err != nil {
					return err
				}

				current = folder
			}
		}

		*f = *current
		return nil
	}

	return ErrCannotCreateFolder
}

func EditFolder(folder *Folder, userid int64) error {
	// We cannot change ownership of a folder
	folder.Owner = userid
	var err error
	folder.Path, err = calculatePath(folder.ParentID, folder.Name, folder.Owner)
	if err != nil {
		return err
	}

	return getDB().Where("owner = ?", userid).Save(folder).Error
}

func DeleteFolder(id uint64, userid int64) error {
	folder, err := GetFolderByID(id, userid)
	if err != nil {
		return err
	}

	children, err := GetChildrenInFolder(folder)
	if err != nil {
		return err
	}

	if children.Length() != 0 {
		return ErrNonEmptyFolder
	}

	return getDB().Where("owner = ?", userid).Delete(&Folder{ID: id}).Error
}

func DeleteFolderRecursive(id uint64, userid int64) error {
	folder, err := GetFolderByID(id, userid)
	if err != nil {
		return err
	}

	children, err := GetChildrenInFolder(folder)
	if err != nil {
		return err
	}

	if children.Length() == 0 {
		return DeleteFolder(id, userid)
	}

	for _, file := range children.Files {
		err = DeleteFile(file.ID, userid)
		if err != nil {
			return err
		}
	}

	for _, folder := range children.Folder {
		err = DeleteFolderRecursive(folder.ID, userid)
		if err != nil {
			return err
		}
	}

	// Delete parent
	err = DeleteFolderRecursive(folder.ID, userid)
	if err != nil {
		return err
	}

	return nil
}

func GetFolderByID(id uint64, userid int64) (*Folder, error) {
	folder := Folder{}
	return &folder,
		getDB().
			Where("owner = ?", userid).
			Take(&folder, id).
			Error
}

func GetFolderByPath(path string, userid int64) (*Folder, error) {
	folder := Folder{}
	return &folder,
		getDB().
			Where("owner = ? AND path = ?", userid, path).
			Take(&folder).
			Error
}

func GetRootOf(userID int64) (*Folder, error) {
	folder := Folder{}
	return &folder,
		getDB().
			Where("owner = ? AND name = ? AND path = ?", userID, "", "/").
			Take(&folder).
			Error
}

func GetFoldersInFolder(parent *Folder) ([]*Folder, error) {
	folders := []*Folder{}
	return folders,
		getDB().
			Where("parent_id = ? AND owner = ?", parent.ID, parent.Owner).
			Find(&folders).
			Error
}

func GetFilesInFolder(parent *Folder) ([]*File, error) {
	files := []*File{}
	return files,
		getDB().
			Where("parent_id = ? AND owner = ?", parent.ID, parent.Owner).
			Find(&files).
			Error

}

func GetChildrenInFolder(parent *Folder) (*FolderContent, error) {
	files, err := GetFilesInFolder(parent)
	if err != nil {
		return nil, err
	}
	folders, err := GetFoldersInFolder(parent)
	if err != nil {
		return nil, err
	}

	return &FolderContent{
		Files:  files,
		Folder: folders,
	}, nil
}

func GetChildrenRecursive(parent *Folder) (*Tree, error) {
	result := &Tree{Root: parent}
	content, err := GetChildrenInFolder(parent)
	if err != nil {
		return nil, err
	}

	result.Files = content.Files
	result.Folders = []*Tree{}

	for _, subDir := range content.Folder {
		t, err := GetChildrenRecursive(subDir)
		if err != nil {
			return nil, err
		}
		result.Folders = append(result.Folders, t)
	}

	return result, nil
}
