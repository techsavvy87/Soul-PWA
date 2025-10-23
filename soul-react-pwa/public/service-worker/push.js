self.addEventListener("push", onPush);
console.log("Service Worker: Push event listener registered.");

function onPush(event) {
  if (event.data) {
    const data = event.data.json();
    const { title, body, ...rest } = data;

    event.waitUntil(
      (async () => {
        // Send the push data to open clients (React app)
        const clients = await self.clients.matchAll();
        clients.forEach((client) => client.postMessage(data));

        // Show system notification
        await self.registration.showNotification(title, {
          ...rest,
          body: typeof body === "string" ? body : JSON.stringify(body),
        });
      })()
    );
  }
}
