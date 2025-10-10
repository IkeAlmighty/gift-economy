export async function createContribution(contributionData) {
  const res = await fetch("/api/listings/my-contributions", {
    method: "POST",
    body: contributionData,
  });

  return res;
}

export async function getContributionsInNetwork() {
  const res = await fetch("/api/listings/contributions-in-network");

  if (!res.ok) {
    return await res.json()?.error;
  } else return await res.json();
}

export async function editContribution({ contributionId, newData }) {}

export async function deleteContribution({ contributionId }) {}
