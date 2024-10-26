// Get required elements
const imgInput = document.querySelector("#imageUpload");
const convertButton = document.querySelector("#convertGrayscale");
const uploadedImage = document.querySelector("#uploadedImage");
const convertedImage = document.querySelector("#grayscaleImage");

// Image data, initialized as undefined
let imageUrlData = undefined;

// Convert user supplied image to Url data
const readImageAsUrl = function (usrImg) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(usrImg);
  });
};

// Displays uploaded image
const setUploadedImage = function () {
  uploadedImage.src = imageUrlData;
};

// Gets and processes the data provided by the user
const getImageFromUser = async function (event) {
  // We can select only 1 image, so we don't have to check if only 1 was sent
  const usrImg = imgInput.files[0];

  // Load image that user sent
  imageUrlData = await readImageAsUrl(usrImg);

  // Show the uploaded image
  setUploadedImage();
};

// Create an Image with a given source
const loadImage = function (src) {
  return new Promise((resolve, reject) => {
    img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Converts each pixel to grayscale
const convertPixelsToGrayscale = function (data) {
  // slightly different from ordinary average
  // It takes into account, that human eye
  // is better at recognising green color
  const redConst = 0.299;
  const greenConst = 0.587;
  const blueConst = 0.114;

  // Convert all pixels
  for (let i = 0; i < data.length; i += 4) {
    const value =
      data[i] * redConst + data[i + 1] * greenConst + data[i + 2] * blueConst;
    data[i] = value; // red
    data[i + 1] = value; // green
    data[i + 2] = value; // blue
  }

  return data;
};

// Prepares Canvas for converting
const prepareCanvas = async function (canvas) {
  try {
    context = canvas.getContext("2d");

    // Load image from data
    const uploadedImage = await loadImage(imageUrlData);

    // Get dimensions of the image
    const baseImageWidth = uploadedImage.width;
    const baseImageHeight = uploadedImage.height;

    // Set dimensions of the canvas
    canvas.width = baseImageWidth;
    canvas.height = baseImageHeight;

    // Draw the uploaded image on the canvas
    context.drawImage(uploadedImage, 0, 0);

    return context;
  } catch (e) {
    throw e;
  }
};

// Converts image to Grayscale
const convertImageToGrayscale = async function () {
  try {
    // Prepare canvas
    const canvas = convertedImage;
    const context = await prepareCanvas(canvas);

    // Convert to grayscale
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData.data = convertPixelsToGrayscale(imageData.data);
    context.putImageData(imageData, 0, 0);

    // Display grayscale image
    convertedImage.src = canvas;
  } catch (e) {
    // Alert that something went very wrong
    alert("Obraz jest niepoprawny");
  }
};

// Add event listeners
imgInput.addEventListener("change", getImageFromUser);
convertButton.addEventListener("click", convertImageToGrayscale);

// Zadanie 1: Wybierz niezbędne elementy DOM
// Przykład: Musisz uzyskać odniesienia do elementów takich jak input pliku, przycisk, img i canvas.
// Wskazówka: Użyj document.getElementById lub podobnych metod, aby uzyskać elementy po ich ID.

// Zadanie 2: Dodaj nasłuchiwacz zdarzeń dla przesyłania obrazu
// Kiedy użytkownik wybierze obraz, wyświetl go w elemencie <img>.
// Wskazówka: Możesz użyć API FileReader, aby odczytać plik jako URL danych.

// Zadanie 3: Dodaj nasłuchiwacz zdarzeń do przycisku „Konwertuj na odcienie szarości”
// Po kliknięciu, skonwertuj wyświetlany obraz na odcienie szarości i pokaż go w elemencie <canvas>.
// Wskazówka: Musisz użyć elementu canvas i jego kontekstu (2D) oraz zmodyfikować dane pikseli.

// Zadanie 4: Narysuj przesłany obraz na canvasie
// Wskazówka: Użyj drawImage() w kontekście canvasa, aby narysować obraz. Upewnij się, że rozmiar canvasa odpowiada rozmiarowi obrazu.

// Zadanie 5: Skonwertuj obraz na odcienie szarości poprzez manipulowanie danymi pikseli
// Wskazówka: Użyj getImageData() do pobrania danych pikseli, zastosuj formułę dla odcieni szarości, a następnie użyj putImageData(), aby zaktualizować canvas.

// Zadanie opcjonalne: Zastanów się, co się stanie, jeśli nie zostanie przesłany żaden obraz, a przycisk odcieni szarości zostanie kliknięty.
// Wskazówka: Możesz sprawdzić, czy obraz został przesłany, zanim zastosujesz filtr odcieni szarości.
