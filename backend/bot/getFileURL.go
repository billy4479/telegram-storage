package bot

func (i *BotInterface) GetFileURL(fileID string) (string, error) {
	return i.bot.GetFileDirectURL(fileID)
}
