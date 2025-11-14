const addBtn = document.getElementById("add");
const resetBtn = document.getElementById("reset");
const input = document.getElementById("newHabitName");
const habitsContainer = document.getElementById("habits");
const todayLabel = document.getElementById("todayLabel");

todayLabel.textContent = new Date().toDateString();

let habits = [];

async function loadHabitsFromDB() {
  try {
    const res = await fetch("http://localhost:5000/habits");
    const data = await res.json();

    habits = data.map(h => ({
      id: h.id,
      name: h.habit,
      done: h.status === "Completed"
    }));

    renderHabits();
  } catch (err) {
    console.error("Error loading habits:", err);
  }
}

async function loadHabits() {
    const res = await fetch("http://localhost:5000/habits");
    const data = await res.json();

    const list = document.getElementById("habit-list");
    console.log(list);   
    list.innerHTML = ""; 

    data.forEach(h => {
        const item = document.createElement("div");
        item.className = "habit-item";

        item.innerHTML = `
            <h3>${h.habit}</h3>
            <p>Status: ${h.status}</p>
        `;

        list.appendChild(item);
    });
}

// loadHabits();

function renderHabits() {
  habitsContainer.innerHTML = "";

  habits.forEach((habit, index) => {
    const div = document.createElement("div");
    div.classList.add("habit");

    div.innerHTML = `
      <h3>${habit.name}</h3>
      <div class="actions">
          <button class="select">${habit.done ? "✓" : "Select"}</button>
          <button class="delete">Delete</button>
      </div>
    `;

    const selectBtn = div.querySelector(".select");
    selectBtn.addEventListener("click", () => {
      habit.done = !habit.done;
      renderHabits();
    });

    const deleteBtn = div.querySelector(".delete");
    deleteBtn.addEventListener("click", async () => {
      await deleteHabitFromDB(habit.id);
      habits.splice(index, 1);
      renderHabits();
    });

    habitsContainer.appendChild(div);
  });
}


addBtn.addEventListener("click", async () => {
  const name = input.value.trim();
  if (!name) return alert("Enter a habit");

  const res = await fetch("http://localhost:5000/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ habit: name, status: "Pending" })
  });

  const result = await res.json();

  habits.push({ id: result.id, name, done: false });

  input.value = "";
  renderHabits();
});

async function deleteHabitFromDB(id) {
  await fetch(`http://localhost:5000/delete/${id}`, { method: "DELETE" });
}

resetBtn.addEventListener("click", () => {
  habits = [];
  habitsContainer.innerHTML = "";
});

window.addEventListener("DOMContentLoaded", loadHabitsFromDB);

