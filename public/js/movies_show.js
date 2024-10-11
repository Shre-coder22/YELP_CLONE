document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const score = document.getElementById("score");
    const upvoteBtn = document.getElementById("upvote_btn"); 
    const downvoteBtn = document.getElementById("downvote_btn"); 

    // Debugging logs
    console.log("Score element:", score);          // Should log the score element
    console.log("Upvote button:", upvoteBtn);      // Should log the upvote button
    console.log("Downvote button:", downvoteBtn);  // Should log the downvote button

    // Function to send the vote
    const sendVote = async (voteType) => {
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
        };

        // Prepare the body based on vote type
        if (voteType === 'up') {
            options.body = JSON.stringify({ voteType: "up", movieId });
        } else if (voteType === 'down') {
            options.body = JSON.stringify({ voteType: "down", movieId });
        } else {
            throw "Invalid vote type";
        }

        // Send vote to the backend
        await fetch("/movies/vote", options)
            .then(data => data.json())
            .then(res => {
                console.log(res);
                handleVote(res.score, res.code); // Update the UI based on the response
            })
            .catch(err => {
                console.error(err);
            });
    };

    // Function to handle the UI update after voting
    const handleVote = (newScore, code) => {
        if (newScore === undefined) {
            console.error('Received undefined score from server!');
            return;
        }
        score.innerText = newScore;  // Update score

        // Update button styles based on vote code
        if (code === 0) {
            upvoteBtn.classList.remove('btn-success');
            upvoteBtn.classList.add('btn-outline-success');
            downvoteBtn.classList.remove('btn-danger');
            downvoteBtn.classList.add('btn-outline-danger');
        } else if (code === 1) {
            upvoteBtn.classList.remove('btn-outline-success');
            upvoteBtn.classList.add('btn-success');
            downvoteBtn.classList.remove('btn-danger');
            downvoteBtn.classList.add('btn-outline-danger');
        } else if (code === -1) {
            upvoteBtn.classList.remove('btn-success');
            upvoteBtn.classList.add('btn-outline-success');
            downvoteBtn.classList.remove('btn-outline-danger');
            downvoteBtn.classList.add('btn-danger');
        } else {
            console.error('Error handling buttons!');
        }
    };

    // Add event listeners to the upvote and downvote buttons
    upvoteBtn.addEventListener("click", async function () {
        sendVote("up");
    });

    downvoteBtn.addEventListener("click", async function () {
        sendVote("down");
    });
});
