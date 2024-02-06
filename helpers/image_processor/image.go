package image_processor

import (
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"path/filepath"
	"strings"

	"github.com/nickalie/go-webpbin"
	"golang.org/x/image/draw"
)

func getFileNameWithoutExtension(filePath string) string {
	fileName := filepath.Base(filePath)
	extension := filepath.Ext(fileName)
	return strings.TrimSuffix(fileName, extension)
}

var sizes = []int{300, 450, 700, 950, 1200}

func decodeImage(file *os.File) (image.Image, error) {
	ext := filepath.Ext(file.Name())

	switch ext {
	case ".png":
		return png.Decode(file)
	case ".jpeg":
		return jpeg.Decode(file)
	case ".webp":
		return webpbin.Decode(file)
	default:
		return nil, fmt.Errorf("unsupported file format")
	}
}

func GenerateResizedImages(sourceImagePath, outputDirectory string) error {
	file, err := os.Open(sourceImagePath)
	if err != nil {
		return err
	}

	defer file.Close()

	img, err := decodeImage(file)
	if err != nil {
		return err
	}

	err = os.MkdirAll(outputDirectory, os.ModePerm)
	if err != nil {
		return err
	}

	for _, size := range sizes {
		resizedImg := resizeImage(img, size)
		outputPath := filepath.Join(outputDirectory, fmt.Sprintf("%s-%d.webp", getFileNameWithoutExtension(sourceImagePath), size))
		outputFile, err := os.Create(outputPath)

		if err != nil {
			return err
		}

		defer outputFile.Close()

		err = webpbin.Encode(outputFile, resizedImg)

		if err != nil {
			return err
		}

		fmt.Printf("Resized image saved at %s\n", outputPath)
	}

	return nil
}

func resizeImage(img image.Image, width int) image.Image {
	bounds := img.Bounds()
	aspectRatio := float64(bounds.Dx()) / float64(bounds.Dy())
	height := int(float64(width) / aspectRatio)

	resizedImg := image.NewRGBA(image.Rect(0, 0, width, height))

	draw.ApproxBiLinear.Scale(resizedImg, resizedImg.Bounds(), img, bounds, draw.Over, nil)

	return resizedImg
}
