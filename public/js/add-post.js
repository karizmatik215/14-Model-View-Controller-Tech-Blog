const newFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value;
  const content = document.querySelector('input[name="content"]').value;

  const response = await fetch(`/api/posts`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      content,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    alert(response.statusText);
  } else {
    document.location.replace('/dashboard');
  }
};

document
  .querySelector('#new-post-form')
  .addEventListener('submit', newFormHandler);
