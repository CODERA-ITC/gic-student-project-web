export function getGreetingByTimeZone(timezone: string): string {
  const rn = new Date();
  let greetingMessage = "";

  // get the time in the specified timezone
  const hour = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(rn);

  const hourNum = parseInt(hour, 10); // convert hour into number

  if (hourNum >= 5 && hourNum < 12) {
    // Morning: 5 AM to 11:59 AM
    greetingMessage = "Good Morning";
    return greetingMessage;
  } else if (hourNum >= 12 && hourNum < 17) {
    // Afternoon: 12 PM to 4:59 PM
    greetingMessage = "Good Afternoon";
    return greetingMessage;
  } else if (hourNum >= 17 && hourNum < 21) {
    // Evening: 5 PM to 8:59 PM
    greetingMessage = "Good Evening";
    return greetingMessage;
  } else {
    // Night: 9 PM to 4:59 AM
    greetingMessage = "Good Night";
    return greetingMessage;
  }
}
