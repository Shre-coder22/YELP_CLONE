
const upvoteBtn = document.getElementById("upvote_btn"); 
const downvoteBtn = document.getElementById("downvote_btn"); 

const sendVote = async (voteType) => {
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
    }

    if(voteType === 'up') {
        options.body = JSON.stringify({voteType: "up",movieId});
    }else if(voteType === 'down') {
        options.body = JSON.stringify({voteType: "down",movieId});
    }else{
        throw "Invalid vote type,"
    }

    await fetch("/movies/vote",options)
    .then(data => {
        return data.json()
    })
    .catch(err => {
        console.log(err);
    })
}


upvoteBtn.addEventListener("click", async function () {
    sendVote("up");
});

downvoteBtn.addEventListener("click", async function () {
    sendVote("down");
});
