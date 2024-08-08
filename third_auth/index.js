async function initPage() {
  const url = new URL(location.href);
  const code = url.searchParams.get("code");

  if (url.searchParams.get("state") === "task_x_bind") {
    localStorage.setItem(
      "task_x_bind",
      JSON.stringify({
        code
      })
    );
    window.close();
    return;
  }

  if (url.searchParams.get("state") === "task_discord_bind") {
    localStorage.setItem(
      "task_discord_bind",
      JSON.stringify({
        code
      })
    );
    window.close();
    return;
  }

  const reqPrefix =
    url.origin === "https://orca.socialswap.com"
      ? "https://orca.socialswap.com"
      : "https://orca.web3-tp.net";

  const reqUrl = `${reqPrefix}/_api/client/r0/twitter/oauth2/login?code=${code}`;

  try {
    const res = await fetch(reqUrl, {
      method: "POST",
    });
    if (res.status === 200) {
      const {
        twitter_access_token,
        twitter_user_base_info,
        twitter_user_base_info: {
          name,
          username,
          twitter_id,
          profile_image_url,
        },
      } = (await res.json());

      localStorage.setItem(
        "third_auth",
        JSON.stringify({
          authType: url.searchParams.get("state"),
          twitter_access_token,
          twitter_user_base_info,
          name,
          username,
          twitter_id,
          profile_image_url,
        })
      );
      window.close();
    } else {
      const content = await res.json();

      document.getElementById("error-title").innerHTML =
        content?.error?.error;
      document.getElementById("error-desc").innerHTML =
        content?.error?.error_description;
      document.getElementById("error-detail").innerHTML =
        content?.error?.error_detail;
      document.getElementById("error-title").style.display = !!content
        ?.error?.error
        ? "block"
        : "none";
      document.getElementById("error-desc").style.display = !!content
        ?.error?.error_description
        ? "block"
        : "none";
      document.getElementById("error-detail").style.display = !!content
        ?.error?.error_detail
        ? "block"
        : "none";
    }
  } catch (err) {
    document.getElementById("error-title").innerHTML = JSON.stringify(err);
    document.getElementById("error-title").style.display = "block";
  }
  document.getElementById("loading").style.display = "none";
}

initPage();
