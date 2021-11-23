let btn = document.querySelector('#remove-btn')
btn.addEventListener("click", async (btn) => {
  let productId = btn.target.parentNode.querySelector("#id").value;
  let csrf_token = btn.target.parentNode.querySelector("#_csrf").value;

  return await fetch(`/clients/remove-item/${productId}`, {
    method: "POST",
    body: {},
    headers: {
      "csrf-token": csrf_token,
    },
  })
    .then((res) => {
        console.log(res)
       return document.querySelector(`#${productId}`).remove()  /// Fix dom element
    })
    .catch((err) => console.log(err));
});