const openForm = document.getElementById("openForm");
const closeForm = document.getElementById("closeForm");
const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");
const search = document.getElementById("search");
const filter = document.getElementById("filter");

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

let skins = JSON.parse(localStorage.getItem("skins")) || [];
let currentPage = 1;
const cardsPerPage = 4;

// Mở/đóng modal
openForm.onclick = () => modal.style.display = "flex";
closeForm.onclick = () => modal.style.display = "none";

// Định dạng USD
function formatUSD(value) {
    return `$${parseFloat(value).toFixed(2)}`;
}

// Thêm skin
addBtn.onclick = () => {
    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value.trim();
    const category = document.getElementById("category").value;

    if(name && price && image){
        skins.push({name, price: parseFloat(price), image, category});
        localStorage.setItem("skins", JSON.stringify(skins));
        renderSkins();
        modal.style.display = "none";

        // Reset form
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("image").value = "";
    } else {
        alert("Vui lòng nhập đầy đủ thông tin skin!");
    }
};

// Render skins + pagination
function renderSkins(){
    const searchValue = search.value.toLowerCase();
    const filterValue = filter.value;

    const filteredSkins = skins.filter(skin => 
        skin.name.toLowerCase().includes(searchValue) &&
        (filterValue === "all" || skin.category === filterValue)
    );

    const totalPages = Math.ceil(filteredSkins.length / cardsPerPage);
    if(currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const skinsToShow = filteredSkins.slice(start, end);

    list.innerHTML = skinsToShow.map((skin, index) => `
        <div class="card">
            <img src="${skin.image}" alt="${skin.name}">
            <h3>${skin.name}</h3>
            <p>${formatUSD(skin.price)}</p>
            <small>${skin.category}</small>
            <div class="card-actions">
                <button class="buyBtn" data-index="${start + index}">Buy</button>
                <button class="deleteBtn" data-index="${start + index}">Delete</button>
            </div>
        </div>
    `).join("");

    // Cập nhật số trang 1/4
    pageInfo.textContent = `${currentPage}/${totalPages || 1}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

    // Buy
    document.querySelectorAll(".buyBtn").forEach(btn => {
        btn.onclick = (e) => {
            const i = e.target.dataset.index;
            alert(`Bạn đã mua: ${skins[i].name} với giá ${formatUSD(skins[i].price)} 🎮`);
        }
    });

    // Delete
    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.onclick = (e) => {
            const i = e.target.dataset.index;
            if(confirm(`Bạn có chắc muốn xoá skin "${skins[i].name}"?`)){
                skins.splice(i, 1);
                localStorage.setItem("skins", JSON.stringify(skins));
                renderSkins();
            }
        }
    });
}

// Pagination
nextPageBtn.onclick = () => { currentPage++; renderSkins(); };
prevPageBtn.onclick = () => { currentPage--; renderSkins(); };

// Reset page khi search/filter
search.addEventListener("input", () => { currentPage=1; renderSkins(); });
filter.addEventListener("change", () => { currentPage=1; renderSkins(); });

// Render lần đầu
renderSkins();