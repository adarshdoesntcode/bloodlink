

const unverfiedcampaignContainer = document.querySelector(".campaign-list-unverified");
const unverfiedcampaignInfo = document.querySelector(".unverified-campaign-info");

const fundingcampaignContainer = document.querySelector(".campaign-list-funding");
const fundingcampaignInfo = document.querySelector(".funding-campaign-info");

const completecampaignContainer = document.querySelector(".campaign-list-complete");
const completecampaignInfo = document.querySelector(".complete-campaign-info");

const endedcampaignContainer = document.querySelector(".campaign-list-ended");
const endedcampaignInfo = document.querySelector(".ended-campaign-info");



const ap = document.querySelector(".total-ap");
const bp = document.querySelector(".total-bp");
const abp = document.querySelector(".total-abp");
const op = document.querySelector(".total-op");
const an = document.querySelector(".total-an");
const bn = document.querySelector(".total-bn");
const abn = document.querySelector(".total-abn");
const on = document.querySelector(".total-on");



const toRa = document.querySelector(".total-raised");
const na = document.querySelector(".total-np");
const ind = document.querySelector(".total-ind");
const re20 = document.querySelector(".total-20");
const withdraw = document.querySelector(".total-withdraw");

const tdCa = document.querySelector(".td-cmp");
const tdRa = document.querySelector(".td-raised");
const tdInd = document.querySelector(".td-ind");
const tdRe20 = document.querySelector(".td-20");
const tdWithdraw = document.querySelector(".td-withdraw");

const statementContainer = document.querySelector(".statement-container");
const withdrawlContainer = document.querySelector(".withdrawl-container");

const loadStatement = async()=>{
  const res = await axios({
    method:"GET",
    url:"/admin/campaignsTransactions"
  })

  const transactions = res.data.data.transactions;

  let HTML = [];

  HTML = transactions.map((transac)=>{
    let date = new Date(transac.createdAt)
    return `
    <p class="statem"><span class="title">${transac.titleOfCampaign}</span> <span class="date">${date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</span><span class="amount">Rs ${transac.amount}</span></p>
    
    `
  }).join("");

  statementContainer.innerHTML = `<span class="dashbox-title">Recent Transactions</span>` + HTML

}

const loadWithdrawn = async()=>{
  const res = await axios({
    method:"GET",
    url:"http://127.0.0.1:3000/admin/campaignWithdraw"
  })

  const campaigns = res.data.data.campaign;

  let HTML = [];

  HTML = campaigns.map((campaign)=>{
    return `
    <p class="statem"><span class="title">${campaign.campaignTitle}</span> <span class="type">${campaign.campaignType}</span><span class="amount">Rs ${campaign.withdrawnAmount}</span></p>

    `
  }).join("");

  withdrawlContainer.innerHTML = `<span class="dashbox-title">Withdrawn Campaigns</span>` + HTML;
}

const loadDonorCount = async()=>{

  const res = await axios({
    method:"GET",
    url:"/admin/adminPortal/activeDonarCount",
  })

   const donor = res.data.data;

   loadBarChart(donor);
    // ap.textContent = donor.ap;
    // bp.textContent = donor.bp;
    // abp.textContent = donor.abp;
    // op.textContent  = donor.op;
    // an.textContent = donor.an;
    // bn.textContent = donor.bn;
    // abn.textContent = donor.abn;
    // on.textContent = donor.on;


  //  const revenueS =  res.data.data.revenueStatics;
  //  toRa.textContent = 'Rs ' + (revenueS.totalRaised.toLocaleString("hi-IN"));
  //  na.textContent = 'Rs ' + (revenueS.nonProfitCampaignAmount.toLocaleString("hi-IN"));
  //  ind.textContent = 'Rs ' + (revenueS.individualCampaignAmount.toLocaleString("hi-IN"));
  //  re20.textContent = 'Rs ' + (revenueS.commissionAmount.toLocaleString("hi-IN"));
  //  withdraw.textContent = 'Rs ' + (revenueS.withdrawnAmount.toLocaleString("hi-IN"));

}

const loadallStats = async ()=>{
  const res = await axios({
    method:"GET",
    url:"/admin/adminPortal/getAllStats",

  })
  console.log(res);
   const stat =  res.data.data;
   loadDonutChart(stat);
   toRa.textContent = (stat.totalUserCount);
   na.textContent = (stat.totalCampaingCount);
   ind.textContent = (stat.totalRequestCount);
   re20.textContent = (stat.totalSuccessfulRequest);
  //  withdraw.textContent = 'Rs ' + (stat.withdrawnAmount.toLocaleString("hi-IN"));

}

const loadDonutChart = (data)=>{
  const ctx = document.getElementById('requestchart');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Unsuccessful','Successful'],
      datasets: [{
        label: 'no of requests',
        data: [ data.totalRequestCount-data.totalSuccessfulRequest,data.totalSuccessfulRequest,],
        backgroundColor: ["#F7A4A4","#B6E2A1"]
      }]
    }
  });
}

const loadToday = async()=>{
  const res = await axios({
    method:"GET",
    url:"http://127.0.0.1:3000/admin/adminPortal/todaysStats"
  })

  const today = res.data.data;

  tdCa.textContent = today.newCampaigns;
  tdRa.textContent ='Rs ' + today.totalRaised.toLocaleString("hi-IN");
  tdInd.textContent ='Rs ' + today.individualAmount.toLocaleString("hi-IN");
  tdRe20.textContent ='Rs ' + today.commissionAmount.toLocaleString("hi-IN"); 
  tdWithdraw.textContent ='Rs ' + today.nonProfit.toLocaleString("hi-IN");
}

const loadUnverifiedUserList = async () => {
  let userHTML = [];
  userHTML.push(`                <article class="campaign-container-uv">
  <h3 class="campaign-title" >----------</h3>
  <div class="campaign-info"><div class="campaign-status">-------</div><div class="campaign-type">-------</div></div>
  <div class="campaign-created">----</div>
  
</article>`);

  const res = await axios({
    method: "GET",
    url: "/admin/unverifiedUsers",
  });

  console.log(res);
  if (res.data.status === "success" && res.data.results > 0) {
    userHTML = res.data.data.users
      .map((user) => {
        let date = new Date(user.createdAt);
        return `
      
      <article class="campaign-container-uv" data-id = ${user._id}>
      <h3 class="campaign-title" style="margin-top: 0;">${
        user.name
      }</h3>
      <div class="campaign-info"><div class="campaign-status">${
        user.status
      }</div><div class="campaign-type">${user.role}</div></div>
      <div class="campaign-created">${date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</div>
      
      </article> 
      
      
      `;
      })
      .join("");
  }

  unverfiedcampaignContainer.innerHTML = userHTML;

  addUserListener();
};

const loadUnverifiedCampaignList = async () => {
  let campaignHTML = [];
  campaignHTML.push(`                <article class="campaign-container-fu">
  <h3 class="campaign-title" >----------</h3>
  <div class="campaign-info"><div class="campaign-status">-------</div><div class="campaign-type">-------</div></div>
  <div class="campaign-created">----</div>
  
</article>`);

console.log(campaignHTML);

  const res = await axios({
    method: "GET",
    url: "/admin/unverifiedCampaigns",
  });

  console.log("campaigns", res);

  if (res.data.status === "success" && res.data.results > 0) {
    campaignHTML = res.data.data.campaign
      .map((campaign) => {
        // let date = new Date(campaign.createdAt);
        return `
      
      <article class="campaign-container-fu" data-id = ${campaign._id}>
      <h3 class="campaign-title" style="margin-top: 0;">${campaign.campaignTitle}</h3>
      <div class="campaign-info"><div class="campaign-status">${campaign.campaignStatus}</div><div class="campaign-type">Address:  ${campaign.campaignAddress}</div></div>
      <div class="campaign-created"></div>
      
      </article> 
      
      
      `;
      })
      .join("");
  }

  fundingcampaignContainer.innerHTML = campaignHTML;

  addCampaignListener();
};

const loadCompleteList = async () => {
  let campaignHTML = [];
  campaignHTML.push(`                <article class="campaign-container-co">
  <h3 class="campaign-title" >----------</h3>
  <div class="campaign-info"><div class="campaign-status">-------</div><div class="campaign-type">-------</div></div>
  <div class="campaign-created">----</div>
  
</article>`);

  const res = await axios({
    method: "GET",
    url: "http://127.0.0.1:3000/admin/adminPortal/completedCollection",
  });


  if (res.data.status === "success" && res.data.campaignResult > 0) {
    campaignHTML = res.data.data.campaignTransactionDetail
      .map((campaign) => {
        // let date = new Date(campaign.createdAt);
        return `
      
      <article class="campaign-container-co" data-id = ${campaign.campaignID}>
      <h3 class="campaign-title" style="margin-top: 0;">${campaign.titleOfCampaign}</h3>
      <div class="campaign-info"><div class="campaign-status">COMPLETE</div><div class="campaign-type">Raised: Rs ${campaign.totalAmount}</div></div>
      <div class="campaign-created"></div>
      
      </article> 
      
      
      `;
      })
      .join("");
  }

  completecampaignContainer.innerHTML = campaignHTML;

  addCompleteListener();
};

const loadEndedList = async () => {
  let campaignHTML = [];
  campaignHTML.push(`                <article class="campaign-container-en">
  <h3 class="campaign-title" >----------</h3>
  <div class="campaign-info"><div class="campaign-status">-------</div><div class="campaign-type">-------</div></div>
  <div class="campaign-created">----</div>
  
</article>`);

  const res = await axios({
    method: "GET",
    url: "http://127.0.0.1:3000/admin/adminPortal/endedCollection",
  });

  if (res.data.status === "success" && res.data.campaignResult > 0) {
    campaignHTML = res.data.data.campaignTransactionDetail
      .map((campaign) => {
        // let date = new Date(campaign.createdAt);
        return `
      
      <article class="campaign-container-en" data-id = ${campaign.campaignID}>
      <h3 class="campaign-title" style="margin-top: 0;">${campaign.titleOfCampaign}</h3>
      <div class="campaign-info"><div class="campaign-status">ENDED</div><div class="campaign-type">Raised: Rs ${campaign.totalAmount}</div></div>
      <div class="campaign-created"></div>
      
      </article> 
      
      
      `;
      })
      .join("");
  }

  endedcampaignContainer.innerHTML = campaignHTML;

  addEndedListener();
};


const addUserListener = () => {
  const camps = unverfiedcampaignContainer.querySelectorAll(
    ".campaign-container-uv"
  );

  camps.forEach((camp) => {
    camp.addEventListener("click", async (e) => {
      unverfiedcampaignInfo.style.width = "70%";

      const id = e.currentTarget.dataset.id;
      if (id) {
        unverfiedcampaignInfo.innerHTML = "Loading....";
        // unverfiedcampaignInfo.style.width = '70%';

        const res = await axios({
          method: "GET",
          url: `/admin/adminPortal/user/${id}`,
        });

      
        let data = res.data.data.user;
        let cdate = new Date(data.createdAt);
        // let edate = new Date(data.campaignEndDate);

        unverfiedcampaignInfo.innerHTML = `
      <h1 style="margin-top: 0;">Name : ${data.name}</h1>
<div class="info-arrange">
<strong>Face Image</strong><br>
<img src="${data.campaignImage}" width="65%">
<strong>Government Document</strong><br>
<img src="${data.campaignImage}" width="65%">
<strong>Medical Document</strong><br>
<img src="${data.campaignImage}" width="65%">
  <div class="info">
    <strong>ID :</strong> ${data._id} <br>
    <strong>Status :</strong> ${data.status}<br>
    <strong>Blood Group :</strong> ${data.bloodGroup}<br>

    <strong>Created On :</strong> ${cdate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })} <br>
    <strong>Role:</strong> ${data.role} <br>
    <strong>Address :</strong> ${data.address} <br>
    <strong>Email :</strong> ${data.email} <br>
    <strong>Contact :</strong> ${data.phoneNumber} <br>
  </div>
</div>
  <br>
      <div class="confirmation-buttons">

        <a id="approve" href="/admin/adminPortal/userApproves/${
          data._id
        }" onclick="return confirm('Are you sure?')">Approve</a>
      </div>
      `;
      } else {
        unverfiedcampaignInfo.innerHTML = "No Campaigns";
      }
    });
  });
};

const addCampaignListener = () => {
  const camps = fundingcampaignContainer.querySelectorAll(
    ".campaign-container-fu"
  );

  camps.forEach((camp) => {
    camp.addEventListener("click", async (e) => {
      fundingcampaignInfo.style.width = "70%";
      const id = e.currentTarget.dataset.id;
      if (id) {
        fundingcampaignInfo.innerHTML = "Loading....";
        const res = await axios({
          method: "GET",
          url: `/admin/adminPortal/campaign/${id}`,
        });

        let data = res.data.data.campaign;
        let cdate = new Date(data.createdAt);
        let edate = new Date(data.campaignEndDate);

        fundingcampaignInfo.innerHTML = `
      <h1 style="margin-top: 0;">Title : ${data.campaignTitle}</h1>
<div class="info-arrange">
<img src="${data.campaignImage}" width="65%">
  <div class="info">
    <strong>ID :</strong> ${data._id} <br>
    <strong>Status :</strong> ${data.campaignStatus}<br>
    <strong>Created On :</strong> ${cdate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}<br>
    <strong>End On :</strong> ${edate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })} <br>
    <strong>Address :</strong> ${data.campaignAddress} <br>
    <strong>Goal Pints :</strong> ${data.goalPint} <br>
    <strong>Email :</strong> ${data.contactEmail} <br>
    <strong>Contact :</strong> ${data.contactNumber} <br>
  </div>
</div>
  <strong>Description :</strong> ${data.description} <br>
  <br>
  <div class="confirmation-buttons">
  <a id="decline" href="/admin/adminPortal/campaignEnds/${
    data._id
  }" onclick="return confirm('Are you sure?')">Decline</a>
  <a id="approve" href="/admin/adminPortal/campaignApproves/${
    data._id
  }" onclick="return confirm('Are you sure?')">Approve</a>
</div>
      `;
      } else {
        fundingcampaignInfo.innerHTML = "No Campaigns";
      }
    });
  });
};

const addCompleteListener = () => {
  const camps = completecampaignContainer.querySelectorAll(
    ".campaign-container-co"
  );

  camps.forEach((camp) => {
    camp.addEventListener("click", async (e) => {
      completecampaignInfo.style.width = "70%";
      const id = e.currentTarget.dataset.id;
      if (id) {
        completecampaignInfo.innerHTML = "Loading....";
        const res = await axios({
          method: "GET",
          url: `http://127.0.0.1:3000/admin/adminPortal/${id}`,
        });

        let data = res.data.data.campaign;
        let cdate = new Date(data.createdAt);
        let edate = new Date(data.campaignDuration);

        completecampaignInfo.innerHTML = `
      <h1 style="margin-top: 0;">Title : ${data.campaignTitle}</h1>
<div class="info-arrange">
<img src="${data.campaignImage}" width="65%">
  <div class="info">
    <strong>ID :</strong> ${data._id} <br>
    <strong>Status :</strong> ${data.campaignStatus}<br>
    <strong>Created On :</strong> ${cdate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}<br>
    <strong>End On :</strong> ${edate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })} <br>
    <strong>Campaign Type :</strong> ${data.campaignType} <br>
    <strong>Address :</strong> ${data.campaignAddress} <br>
    <strong>Goal Amount :</strong> रू ${data.goalAmount} <br>
    <strong>Organizer :</strong> ${data.organizerName} <br>
    <strong>Email :</strong> ${data.contactEmail} <br>
    <strong>Contact :</strong> ${data.contactNumber} <br>
    <strong>Social Link :</strong> ${data.socialMediaLink} <br>
  </div>
</div>
  <strong>Description :</strong> ${data.description} <br>
  <br>
  <strong>Story :</strong> ${data.reasonBehindCampaign} <br> 
     
      `;
      } else {
        completecampaignInfo.innerHTML = "No Campaigns";
      }
    });
  });
};

const addEndedListener = () => {
  const camps = endedcampaignContainer.querySelectorAll(
    ".campaign-container-en"
  );

  camps.forEach((camp) => {
    camp.addEventListener("click", async (e) => {
      endedcampaignInfo.style.width = "70%";
      const id = e.currentTarget.dataset.id;
      if (id) {
        endedcampaignInfo.innerHTML = "Loading....";
        const res = await axios({
          method: "GET",
          url: `http://127.0.0.1:3000/admin/adminPortal/${id}`,
        });

        let data = res.data.data.campaign;
        let cdate = new Date(data.createdAt);
        let edate = new Date(data.campaignDuration);

        endedcampaignInfo.innerHTML = `
      <h1 style="margin-top: 0;">Title : ${data.campaignTitle}</h1>
<div class="info-arrange">
<img src="${data.campaignImage}" width="65%">
  <div class="info">
    <strong>ID :</strong> ${data._id} <br>
    <strong>Status :</strong> ${data.campaignStatus}<br>
    <strong>Created On :</strong> ${cdate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}<br>
    <strong>End On :</strong> ${edate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })} <br>
    <strong>Campaign Type :</strong> ${data.campaignType} <br>
    <strong>Address :</strong> ${data.campaignAddress} <br>
    <strong>Goal Amount :</strong> रू ${data.goalAmount} <br>
    <strong>Organizer :</strong> ${data.organizerName} <br>
    <strong>Email :</strong> ${data.contactEmail} <br>
    <strong>Contact :</strong> ${data.contactNumber} <br>
    <strong>Social Link :</strong> ${data.socialMediaLink} <br>
  </div>
</div>
  <strong>Description :</strong> ${data.description} <br>
  <br>
  <strong>Story :</strong> ${data.reasonBehindCampaign} <br> 
     
      `;
      } else {
        endedcampaignInfo.innerHTML = "No Campaigns";
      }
    });
  });
};

const loadBarChart = (data)=> {
  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'],
      datasets: [{
        label: 'no of donors',
        data: [data.ap, data.bp, data.abp, data.op, data.an, data.bn,data.abn,data.on],
        backgroundColor: ["#F7A4A4", "#FEBE8C", "#FFEBB4", "#B6E2A1"], 
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
            display: false
        },
    },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false
         },
         
        },
        x:{
          grid:{
            display:false
          }
        }
      }
    }
  });
}




loadDonorCount();
loadallStats();
// loadToday();
// loadStatement();
// loadWithdrawn();
loadUnverifiedUserList();
loadUnverifiedCampaignList();
// loadCompleteList();
// loadEndedList();