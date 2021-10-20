package db

type File struct {
	Name      string
	Path      string `gorm:"primaryKey"`
	Owner     int
	ChatID    int64
	MessageID int
	URL       string
}

func GetFile(path string) (*File, error) {
	f := File{}
	return &f, getDB().Where("path = ?", path).Take(&f).Error
}

func PutFile(f *File) error {
	return getDB().Create(f).Error
}
