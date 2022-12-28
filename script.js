const fileInput = document.querySelector(".file-input");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const rotateOptions = document.querySelectorAll(".rotate button");
const previewImg = document.querySelector(".preview-img img");
const chooseImgBtn = document.querySelector(".choose-img");
const resetFilterBtn = document.querySelector(".reset-filter");
const saveImgBtn = document.querySelector(".save-img");
let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0;

let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;
/// applying filter to the image
const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};
const loadImage = () => {
  let file = fileInput.files[0]; //get the user selected file
  if (!file) return; // return if user has not selected a file
  previewImg.src = URL.createObjectURL(file); // passing file url as a preview url
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click(); // reset the filter value when user select new image
    document.querySelector(".container").classList.remove("disable");
  });
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    //adding click event listener to all the filter buttons
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;
    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

// updating the value of the options available for filter
const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active"); //getting the selector filter
  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilter();
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    //adding click function to all the rotate buttons
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      //if flipHorizontal value is 1, set this value to -1 else set 1
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

const resetFilter = () => {
  //resetting all the filter applied
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;

  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;

  filterOptions[0].click(); //clicking brightness btn, so the broghtness selected by default
  applyFilter();
};

// canvas is required to download image with filter

const saveImage = () => {
  const canvas = document.createElement("canvas"); // create a canvas
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;

  //applying the filter selected by the user
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) 
  grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2); // translating the canvas
  if (rotate !== 0) {
    // if rotate is not 0 , rotate the canvas
    ctx.rotate((rotate * Math.PI) / 180);
  }
  //applying the flips to the canvas horizontal and vertical;
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
  const link = document.createElement("a"); // creating a tag element
  link.download = "image.jpg"; //passing a tag download value to "image.jpg"
  link.href = canvas.toDataURL(); //passing a tag herl value to the canvas data url
  saveImgBtn.innerText = "SAVING IMAGE...";
  saveImgBtn.style.opacity = "0.7";
  var saveDataImg = setInterval(() => {
    link.click(); //clicking the a tag so the image is downloaded
    saveImgBtn.innerText = "SAVE IMAGE";
    saveImgBtn.style.opacity = null;
    clearInterval(saveDataImg);
  }, 900);
};

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
