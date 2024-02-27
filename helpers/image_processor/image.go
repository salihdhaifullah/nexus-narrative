package image_processor

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"time"

	"github.com/nickalie/go-webpbin"
	"golang.org/x/image/draw"
)

var sizes = []int{300, 450, 700, 950, 1200}

func decodeImageX(imageBytes []byte, mimeType string) (image.Image, error) {
	reader := bytes.NewReader(imageBytes)

	switch mimeType {
	case "jpeg", "jpg":
		return jpeg.Decode(reader)
	case "png":
		return png.Decode(reader)
	case ".webp":
		return webpbin.Decode(reader)
	default:
		return nil, fmt.Errorf("unsupported image format: %s", mimeType)
	}
}

type ImageData struct {
	Name string
	Data []byte
}

func GenerateResizedImages(sourceImagePath []byte, mime string) ([]ImageData, error) {
	img, err := decodeImageX(sourceImagePath, mime)
	if err != nil {
		return nil, err
	}

	images := []ImageData{}

	for _, size := range sizes {
		resizedImg := resizeImage(img, size)
		name := fmt.Sprintf("%d-%d.webp", time.Now().Unix(), size)
		buf := bytes.Buffer{}
		err = webpbin.Encode(&buf, resizedImg)

		if err != nil {
			return nil, err
		}

		images = append(images, ImageData{Name: name, Data: buf.Bytes()})
	}

	return images, nil
}

func resizeImage(img image.Image, width int) image.Image {
	bounds := img.Bounds()
	aspectRatio := float64(bounds.Dx()) / float64(bounds.Dy())
	height := int(float64(width) / aspectRatio)

	resizedImg := image.NewRGBA(image.Rect(0, 0, width, height))

	draw.ApproxBiLinear.Scale(resizedImg, resizedImg.Bounds(), img, bounds, draw.Over, nil)

	return resizedImg
}
