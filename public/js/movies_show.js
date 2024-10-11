document.addEventListener('DOMContentLoaded', () => {
    const score = document.getElementById("score");
    const upvoteBtn = document.getElementById("upvote_btn"); 
    const downvoteBtn = document.getElementById("downvote_btn"); 

    const sendVote = async (voteType) => {
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
        };

        // Prepare the body based on vote type
        options.body = JSON.stringify({ voteType, movieId });

        // Send vote to the backend
        await fetch("/movies/vote", options)
            .then(data => data.json())
            .then(res => {
                handleVote(res.score, res.code); // Update the UI based on the response
            })
            .catch(err => {
                console.error(err);
            });
    };

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

    upvoteBtn.addEventListener("click", () => sendVote("up"));
    downvoteBtn.addEventListener("click", () => sendVote("down"));
});

document.getElementById('watchedCheckbox').addEventListener('change', function() {
    const movieId = this.getAttribute('data-movie-id');
    fetch(`/movies/${movieId}/toggle-watch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
      .then(data => {
          if (!data.success) {
              alert('Failed to update watch status.');
          }
      }).catch(err => console.error(err));
});
