document.addEventListener("DOMContentLoaded", () => {

    interface Product {
        name: string;
        price: number;
        category: string;
        image: string;
    }

    let products: Product[] = [];

    const list = document.getElementById("list") as HTMLElement;
    const search = document.getElementById("search") as HTMLInputElement;
    const filter = document.getElementById("filter") as HTMLSelectElement;

    const modal = document.getElementById("modal") as HTMLElement;
    const openBtn = document.getElementById("openForm") as HTMLElement;
    const closeBtn = document.getElementById("closeForm") as HTMLElement;
    const addBtn = document.getElementById("addBtn") as HTMLElement;

    function render(data: Product[]) {
        list.innerHTML = "";

        data.forEach((p, index) => {
            list.innerHTML += `
            <div class="card">
                <img src="${p.image}" />
                <span>${p.category}</span>
                <h3>${p.name}</h3>
                <p>$${p.price.toLocaleString()}</p>
                <button onclick="deleteProduct(${index})">Xoá</button>
            </div>
            `;
        });
    }

    openBtn.onclick = () => modal.style.display = "block";
    closeBtn.onclick = () => modal.style.display = "none";

    addBtn.onclick = () => {
        const name = (document.getElementById("name") as HTMLInputElement).value;
        const price = +(document.getElementById("price") as HTMLInputElement).value;
        const category = (document.getElementById("category") as HTMLSelectElement).value;
        const image = (document.getElementById("image") as HTMLInputElement).value;

        if (!name || price <= 0 || !image) {
            alert("Nhập thiếu!");
            return;
        }

        products.push({ name, price, category, image });
        applyFilter();
        modal.style.display = "none";
    };

    function applyFilter() {
        const key = search.value.toLowerCase();
        const cate = filter.value;

        let result = products;

        if (cate !== "all") {
            result = result.filter(p => p.category === cate);
        }

        if (key) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(key)
            );
        }

        render(result);
    }

    search.addEventListener("input", applyFilter);
    filter.addEventListener("change", applyFilter);

    (window as any).deleteProduct = (index: number) => {
        products.splice(index, 1);
        applyFilter();
    };

});