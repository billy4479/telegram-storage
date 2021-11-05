package db

import (
	"errors"
	"strings"

	"gorm.io/gorm"
)

type Folder struct {
	ID       uint64 `gorm:"primaryKey" json:"folderID"`
	Name     string `gorm:"non null" json:"name"`
	Path     string `gorm:"non null" json:"path"`
	Owner    int    `gorm:"non null" json:"owner"`
	ParentID uint64 `json:"parentID"`
}

type File struct {
	ID       uint64 `gorm:"primaryKey" json:"fileID"`
	Name     string `gorm:"non null" json:"name"`
	Path     string `gorm:"non null" json:"path"`
	ParentID uint64 `gorm:"non null" json:"parentID"`
	Owner    int    `gorm:"non null" json:"owner"`
	URL      string `gorm:"not null" json:"-"`
}

type FolderContent struct {
	Files  []*File   `gorm:"foreignKey:ID" json:"files"`
	Folder []*Folder `gorm:"foreignKey:ID" json:"folders"`
}

func (f *Folder) GetParent() (*Folder, error) { return GetFolderByID(f.ParentID, f.Owner) }
func (f *File) GetParent() (*Folder, error)   { return GetFolderByID(f.ParentID, f.Owner) }
func (f *FolderContent) Length() int          { return len(f.Files) + len(f.Folder) }

var (
	ErrAlreadyExists      = errors.New("An entry with the same name is already there")
	ErrInvalidPath        = errors.New("The path is invalid")
	ErrCannotCreateFolder = errors.New("Cannot create folder")
	ErrNonEmptyFolder     = errors.New("The folder is not empty")
)

/*** Create ***/

// Create a file and all the folders needed
func CreateFile(file *File) error {
	// Sanitize the path
	err := sanitizePath(&file.Path)
	if err != nil {
		return err
	}

	// Split the path in the directories names
	dirs := strings.Split(file.Path, "/")
	// The last one is the file name
	file.Name = dirs[len(dirs)-1]

	// Create the parent folder path with the other ones
	parent := &Folder{
		Path:  strings.Join(dirs[:len(dirs)-1], "/"),
		Owner: file.Owner,
	}

	// Create the parent if it doesn't exist
	// Skip if the folder is root
	if parent.Path != "" {
		err = CreateFolder(parent)
		if err != nil {
			return err
		}
	} else {
		parent, err = GetRootOf(file.Owner)
		if err != nil {
			return err
		}
	}

	// Set the parent id to the id of the parent folder
	file.ParentID = parent.ID

	// Check if the file is unique
	err = isFileUnique(file)
	if err != nil {
		return err
	}

	// Create the file in the database
	return getDB().Create(file).Error
}

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

/*** Edit ***/

func EditFile(file *File, userid int) error {
	// We cannot change ownership of a file
	file.Owner = userid

	var err error
	file.Path, err = calculatePath(file.ParentID, file.Name, file.Owner)
	if err != nil {
		return err
	}

	return getDB().Where("owner = ?", userid).Save(file).Error
}

func EditFolder(folder *Folder, userid int) error {
	// We cannot change ownership of a folder
	folder.Owner = userid
	var err error
	folder.Path, err = calculatePath(folder.ParentID, folder.Name, folder.Owner)
	if err != nil {
		return err
	}

	return getDB().Where("owner = ?", userid).Save(folder).Error
}

/*** Delete ***/

func DeleteFile(id uint64, userid int) error {
	return getDB().Where("owner = ?", userid).Delete(&File{ID: id}).Error
}

func DeleteFolder(id uint64, userid int) error {
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

func DeleteFolderRecursive(id uint64, userid int) error {
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

/*** Get ***/

func GetRootOf(userID int) (*Folder, error) {
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

func GetFileByID(id uint64, userid int) (*File, error) {
	file := File{}
	return &file,
		getDB().Where("owner = ?", userid).
			Take(&file, id).
			Error
}

func GetFolderByID(id uint64, userid int) (*Folder, error) {
	folder := Folder{}
	return &folder,
		getDB().
			Where("owner = ?", userid).
			Take(&folder, id).
			Error
}

func GetFolderByPath(path string, userid int) (*Folder, error) {
	folder := Folder{}
	return &folder,
		getDB().
			Where("owner = ? AND path = ?", userid, path).
			Take(&folder).
			Error
}

/*** Internals ***/

// Returns nil if it's unique and ErrAlreadyExists if not
func isFileUnique(file *File) error {
	var c int64
	err := getDB().
		Model(&File{}).
		Where("owner = ? AND parent_id = ? AND name = ?",
			file.Owner,
			file.ParentID,
			file.Name).
		Count(&c).
		Error

	if err != nil && err != gorm.ErrRecordNotFound {
		if err == gorm.ErrRecordNotFound {
			return nil
		}
		return err
	}

	if c >= 1 {
		return ErrAlreadyExists
	}
	return nil
}

func sanitizePath(path *string) error {
	// Only root directory can have an empty path
	if *path == "" {
		return ErrInvalidPath
	}

	// Replace \ with /
	*path = strings.ReplaceAll(*path, "\\", "/")

	// If doesn't start with a / assume it does
	if !strings.HasPrefix(*path, "/") {
		*path = "/" + *path
	}

	// Remove last /
	if strings.HasSuffix(*path, "/") {
		*path = (*path)[:len(*path)-1]
	}

	// Ensure no double / are there
	{
		new := ""
		for {
			new = strings.ReplaceAll(*path, "//", "/")
			if *path == new {
				break
			}
			*path = new
		}
	}

	// Not sure if it is a problem but it might
	if strings.Contains(*path, "/..") || strings.Contains(*path, "/.") {
		return ErrInvalidPath
	}

	return nil
}

func createRootOfUser(user *User) error {
	root := &Folder{
		Name:  "",
		Path:  "/",
		Owner: user.TelegramID,
	}
	return getDB().Create(root).Error
}

func calculatePath(parentID uint64, name string, userID int) (string, error) {
	parent, err := GetFolderByID(parentID, userID)
	if err != nil {
		return "", err
	}

	path := parent.Path + "/" + name
	err = sanitizePath(&path)
	return path, err
}
