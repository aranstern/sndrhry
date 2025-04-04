document.addEventListener("DOMContentLoaded", () => {
  const messageForm = document.getElementById("messageForm");
  const toInput = document.getElementById("FromInput");
  const messageInput = document.getElementById("messageInput");
  const notesContainer = document.getElementById("notesContainer");

  // Create character counter
  const charCount = document.createElement("p");
  charCount.id = "charCount";
  charCount.textContent = "50 characters remaining";
  messageForm.appendChild(charCount);

  // Limit input to 50 characters
  messageInput.addEventListener("input", () => {
    const maxChars = 50;
    const currentLength = messageInput.value.length;
    if (currentLength > maxChars) {
      messageInput.value = messageInput.value.substring(0, maxChars);
    }
    const remaining = maxChars - messageInput.value.length;
    charCount.textContent = `${remaining} characters remaining`;
  });

  // Fetch existing messages and display them
  async function fetchMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    displayMessages(messages);
  }

  // Display messages as sticky notes
  function displayMessages(messages) {
    notesContainer.innerHTML = "";  // Clear previous messages
    messages.forEach(({ to, message }) => {
      const note = document.createElement("div");
      note.className = "note";
      note.innerHTML = `<div class="to">To: ${to}</div><p>${message}</p>`;
      notesContainer.appendChild(note);
    });
  }

  // Handle form submission to post a new message
  messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const to = toInput.value.trim();
    const message = messageInput.value.trim();

    if (to && message) {
      if (message.length > 50) {
        alert("Message is too long. Maximum 50 characters allowed.");
        return;
      }

      const response = await fetch('/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message })
      });

      if (response.ok) {
        fetchMessages();  // Refresh messages after posting
        toInput.value = "";
        messageInput.value = "";
        charCount.textContent = "50 characters remaining"; // reset counter
      } else {
        alert("Failed to post message.");
      }
    } else {
      alert("Please fill in both fields.");
    }
  });

  // Initial fetch of messages
  fetchMessages();

  // Poll for new messages every 10 seconds
  setInterval(fetchMessages, 10000);
});
