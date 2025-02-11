export const fetchConcordiaBusData = async () => {
    try {
      const postResponse = await fetch(
        "https://shuttle.concordia.ca/concordiabusmap/WebService/GService.asmx/GetGoogleObject",
        {
          method: "POST",
          headers: {
            "Host": "shuttle.concordia.ca",
            "Content-Length": "0",
            "Content-Type": "application/json; charset=UTF-8",
            "Cookie": "CassieGuid_51f5420f-fce8-4b25-b40d-c315e47c77af=60fabcc2-c5bd-4e34-b2d8-b70517a448ee; SyrenisGuid_51f5420f-fce8-4b25-b40d-c315e47c77af=60fabcc2-c5bd-4e34-b2d8-b70517a448ee; ASP.NET_SessionId=xasgvfviv2awk5ks2qt00bxc; PS_LOGINLIST=https://campus.concordia.ca/pscsprd; PS_TokenSite=https://campus.concordia.ca/psc/pscsprd/?PSCSPRD-PSJSESSIONID; SignOnDefault=; ...",  // Manually include all cookies from the network request
            "Referer": "https://shuttle.concordia.ca/concordiabusmap/Map.aspx",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "x-requested-with": "XMLHttpRequest",
          },
        }
      );
  
      if (!postResponse.ok) {
        throw new Error(`HTTP error! Status: ${postResponse.status}`);
      }
  
      const data = await postResponse.json();
      
      return data;
    } catch (error) {
      console.error("Error fetching Concordia bus data:", error);
      return null;
    }
  };