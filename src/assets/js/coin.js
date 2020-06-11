import axios from "axios";
const deletBtns = document.querySelectorAll(".delete_btn");
const editBtns = document.querySelectorAll(".edit-btn");
const onDeleteCoin = (name) => {
  return axios.delete("/coin", {
    data: {
      name,
    },
  });
};
const onEditCoin = (id, name) => {
  return axios.put("/coin", {
    id,
    name,
  });
};
const onDelete = async (e) => {
  const { target } = e;
  let parent = target;
  while (parent.className !== "coin") {
    parent = parent.parentNode;
  }
  const name = parent.querySelector("p:first-child").textContent;
  const result = await onDeleteCoin(name);
  if (result.status === 200) {
    window.location.reload();
  }
};
const onEdit = async (e) => {
  const { target } = e;
  let parent = target;
  while (!parent.classList.contains("coin")) {
    parent = parent.parentNode;
  }
  const name = parent.querySelector(".coin-name span"),
    input = parent.querySelector(".edit-input");
  if (target.textContent.trim() === "수정") {
    name.style.display = "none";
    input.style.display = "inline-block";
    target.textContent = "확인";
  } else if (target.textContent === "확인") {
    name.style.display = "inline-block";
    input.style.display = "none";
    target.textContent = "수정";
    const result = await onEditCoin(target.dataset["id"], input.value);
    if (result.status === 200) {
      window.location.reload();
    }
  }
};
const init = () => {
  if (deletBtns) {
    [].forEach.call(deletBtns, (btn) => {
      btn.addEventListener("click", onDelete);
    });
  }
  if (editBtns) {
    [].forEach.call(editBtns, (btn) => {
      btn.addEventListener("click", onEdit);
    });
  }
};
init();
