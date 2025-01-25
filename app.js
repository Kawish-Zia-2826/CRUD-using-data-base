// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "api  here",
  authDomain: "crud-bd5ed.firebaseapp.com",
  projectId: "crud-bd5ed",
  storageBucket: "crud-bd5ed.firebasestorage.app",
  messagingSenderId: "721809212415",
  appId: "1:721809212415:web:239eda5c3528598c4a9dca",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let editId = null;

// Add Data
$("#addData").click(async function () {
  const username = $("#username").val();
  const email = $("#email").val();
  const age = $("#age").val();

  try {
    await addDoc(collection(db, "users"), {
      name: username,
      email: email,
      age: parseInt(age),
    });
    alert();
    Swal.fire({
      title: "user Added",
      text: "User added successfully!",
      icon: "success",
    });
    renderTable(); // Refresh table
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

// Render Table
async function renderTable() {
  const querySnapshot = await getDocs(collection(db, "users"));
  const tbody = $("#tbody");
  tbody.empty();
  let i = 1;

  querySnapshot.forEach((doc) => {
    const user = doc.data();
    tbody.append(`
      <tr>
        <td>${i++}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.age}</td>
        <td>
          <button class="btn btn-danger delete-btn" data-id="${
            doc.id
          }">Delete</button>
          <button class="btn btn-info update-btn" data-id="${
            doc.id
          }" data-name="${user.name}" data-email="${user.email}" data-age="${
      user.age
    }">Update</button>
        </td>
      </tr>
    `);
  });

  // Add Event Listeners for Delete and Update Buttons
  $(".delete-btn").click(async function () {
    const id = $(this).data("id");
    await deleteDoc(doc(db, "users", id));

    Swal.fire({
      icon: "error",
      title: "Delete",
      text: "User deleted successfully!",
    });
    renderTable(); // Refresh table
  });

  $(".update-btn").click(function () {
    editId = $(this).data("id");
    $("#username").val($(this).data("name"));
    $("#email").val($(this).data("email"));
    $("#age").val($(this).data("age"));

    $("#addData").hide();
    $("#submitUpdate").show();
  });
}

// Submit Update
$("#submitUpdate").click(async function () {
  const username = $("#username").val();
  const email = $("#email").val();
  const age = $("#age").val();

  try {
    await updateDoc(doc(db, "users", editId), {
      name: username,
      email: email,
      age: parseInt(age),
    });
    Swal.fire({
      title: "User Update Succefully",
      text: "successfully update",
      icon: "success",
    });
    editId = null;
    $("#addData").show();
    $("#submitUpdate").hide();
    $("#dataForm")[0].reset();
    renderTable(); // Refresh table
  } catch (e) {
    console.error("Error updating document: ", e);
  }
});

// Initial Table Render
renderTable();
