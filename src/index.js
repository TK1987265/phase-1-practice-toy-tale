let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Fetch Andy's Toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          const card = createToyCard(toy);
          toyCollection.appendChild(card);
        });
      });
  }

  // Create Toy Card
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.classList.add("card");

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.classList.add("toy-avatar");

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement("button");
    button.textContent = "Like ❤️";
    button.classList.add("like-btn");
    button.dataset.id = toy.id;

    button.addEventListener("click", () => {
      increaseLikes(toy, p);
    });

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    return card;
  }

  // Add New Toy
  toyForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(toyForm);
    const name = formData.get("name");
    const image = formData.get("image");
    const likes = 0;

    const newToy = {
      name,
      image,
      likes
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        const card = createToyCard(toy);
        toyCollection.appendChild(card);
        toyForm.reset();
      });
  });

  // Increase Toy Likes
  function increaseLikes(toy, likeElement) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
      .then(response => response.json())
      .then(updatedToy => {
        likeElement.textContent = `${updatedToy.likes} Likes`;
      });
  }

  // Fetch Andy's Toys when the page loads
  fetchToys();
});
