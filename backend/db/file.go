package db

import (
	"strings"

	"gorm.io/gorm"
)

type File struct {
	ID       uint64 `gorm:"primaryKey" json:"fileID"`
	Name     string `gorm:"non null" json:"name"`
	Path     string `gorm:"non null" json:"path"`
	ParentID uint64 `gorm:"non null" json:"parentID"`
	Owner    int64  `gorm:"non null" json:"owner"`
	FileID   string `gorm:"not null" json:"-"`
}

func (f *File) GetParent() (*Folder, error) { return GetFolderByID(f.ParentID, f.Owner) }

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

func EditFile(file *File, userid int64) error {
	// We cannot change ownership of a file
	file.Owner = userid

	var err error
	file.Path, err = calculatePath(file.ParentID, file.Name, file.Owner)
	if err != nil {
		return err
	}

	return getDB().Where("owner = ?", userid).Save(file).Error
}

func DeleteFile(id uint64, userid int64) error {
	return getDB().Where("owner = ?", userid).Delete(&File{ID: id}).Error
}

func GetFileByID(id uint64, userid int64) (*File, error) {
	file := File{}
	return &file,
		getDB().Where("owner = ?", userid).
			Take(&file, id).
			Error
}

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
