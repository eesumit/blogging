export const handleUsernameCheck = async (value: string, setUsername: (username: string) => void, setError: (error: string | null) => void) => {
  try {
    const res = await fetch(`/api/checkUsername?username=${value}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      if (res.status === 401) {
        setError("You must be signed in to check the username.");
      } else {
        setError("An error occurred while checking the username.");
      }
      return;
    }

    const data = await res.json();
    if (data.exists) {
      setError("Username already exists.");
      return;
    }

    setError(null); // clear previous error
    setUsername(value);
  } catch (error) {
    console.error("Error checking username:", error);
    setError("An unexpected error occurred. Please try again later.");
  }
};