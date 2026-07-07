import { io } from "socket.io-client";

const client = io("http://localhost:3000/");

client.on("connect", () => {
    console.log("Server established connection successfully");
});

client.on("disconnect", () => {
    console.log("Disconnected from server");
});

client.emit("sayHI",(res)=>{
    console.log({res});
    
})

client.on("product", (data) => {
    console.log("Received product:", data);
});
