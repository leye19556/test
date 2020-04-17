import axios from "axios";
const deletBtns = document.querySelectorAll(".delete_btn");
const onDeleteCoin = (name) => {
  console.log(name);
  return axios.delete("/coin", {
    data: {
      name,
    },
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
const init = () => {
  if (deletBtns) {
    [].forEach.call(deletBtns, (btn) => {
      btn.addEventListener("click", onDelete);
    });
  }
};
init();
