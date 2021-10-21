package db

type File struct {
	Name      string `gorm:"non null" json:"name"`
	Path      string `gorm:"non null" json:"path"`
	Owner     int    `gorm:"non null" json:"userID"`
	ChatID    int64  `gorm:"non null" json:"chatID"`
	MessageID int    `gorm:"non null" json:"messageID"`
	URL       string `gorm:"primaryKey" json:"url"`
}

func GetFile(path string) (*File, error) {
	f := File{}
	return &f, GetDB().Where("path = ?", path).Take(&f).Error
}

func GetAllFilesOwnedBy(userID int) ([]File, error) {
	f := []File{}
	return f, GetDB().Where("owner = ?", userID).Find(&f).Error
}

func PutFile(f *File) error {
	return GetDB().Create(f).Error
}
