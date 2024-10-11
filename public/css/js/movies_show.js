
const upvoteBtn = document.getElementById("upvote_btn"); 
const downvoteBtn = document.getElementById("downvote_btn"); 

upvoteBtn.addEventListener("click", async function () {
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({vote:'up'})
    }

    await fetch("/movies/vote",options)
    .then(data => {
        return data.json()
    })
    
})
