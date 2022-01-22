async function editFormHandler(event) {
   event.preventDefault();

   const newTitle = document.querySelector("input").value.trim();
   const newContent = document.querySelector("textarea").value.trim();
   const id = window.location.toString().split("/")[
      window.location.toString().split("/").length - 1
   ];

   const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({
         title: newTitle,
         content: newContent,
      }),
      headers: {
         "Content-Type": "application/json",
      },
   });

   if (response.ok) {
      document.location.replace("/dashboard");
   } else {
      alert(response.statusText);
   }
}

document
   .querySelector(".edit-post-form")
   .addEventListener("submit", editFormHandler);
