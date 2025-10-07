export async function createContribution(contributionData) {
  const res = await fetch("/api/listings/contributions", {
    method: "POST",
    body: contributionData,
  });

  return res;
}

export async function getContributions({ ownerId }) {
  const res = await fetch("/api/listings/contributions");

  if (!res.ok) {
    return await res.json()?.error;
  } else return await res.json();
}

export async function editContribution({ contributionId, newData }) {}

export async function deleteContribution({ contributionId }) {}
