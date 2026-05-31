document.addEventListener("DOMContentLoaded", () => {
  const noteInput = document.getElementById("noteInput");
  const addBtn = document.getElementById("addBtn");
  const todoList = document.getElementById("todoList");
  const filterBtns = document.querySelectorAll(".filter-btn");

  let notes = [];
  let currentFilter = "all";

  async function fetchNotes() {
    const res = await fetch("/notes");
    notes = await res.json();
    renderNotes();
  }

  function renderNotes() {
    todoList.innerHTML = "";

    let filteredNotes = notes.filter(note => {
      if (currentFilter === "completed") return note.completed;
      if (currentFilter === "pending") return !note.completed;
      return true;
    });

    filteredNotes.forEach(note => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = note.text;
      span.className = "task-text";

      if (note.completed) span.classList.add("completed");

      span.addEventListener("click", async () => {
        await fetch(`/notes/${note.id}`, { method: "PUT" });
        fetchNotes();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.className = "delete-btn";

      deleteBtn.addEventListener("click", async () => {
        await fetch(`/notes/${note.id}`, { method: "DELETE" });
        fetchNotes();
      });

      li.appendChild(span);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  }

  addBtn.addEventListener("click", async () => {
    const text = noteInput.value.trim();
    if (text === "") return;

    await fetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    noteInput.value = "";
    fetchNotes();
  });

  noteInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addBtn.click();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".active").classList.remove("active");
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderNotes();
    });
  });

  fetchNotes();
});