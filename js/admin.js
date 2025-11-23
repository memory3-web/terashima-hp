document.addEventListener('DOMContentLoaded', function () {
    // Auth Check
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        alert('ログインが必要です。');
        window.location.href = 'index.html';
        return;
    }

    // DOM Elements
    const orderTableBody = document.getElementById('orderTableBody');
    const pendingOrdersCount = document.getElementById('pendingOrdersCount');
    const todayOrdersCount = document.getElementById('todayOrdersCount');
    const totalSales = document.getElementById('totalSales');
    const refreshBtn = document.getElementById('refreshBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');

    // Modal Elements
    const orderModal = document.getElementById('orderModal');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.close-modal');
    const markShippedBtn = document.getElementById('markShippedBtn');
    const deleteOrderBtn = document.getElementById('deleteOrderBtn');

    let currentOrderId = null;

    // Initialize
    loadOrders();

    // Event Listeners
    refreshBtn.addEventListener('click', loadOrders);

    clearDataBtn.addEventListener('click', function () {
        if (confirm('本当に全てのデータを削除しますか？この操作は取り消せません。')) {
            localStorage.removeItem('nouen_orders');
            loadOrders();
            alert('全データを削除しました。');
        }
    });

    closeModal.addEventListener('click', () => {
        orderModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });

    markShippedBtn.addEventListener('click', function () {
        if (currentOrderId) {
            updateOrderStatus(currentOrderId, '発送済み');
            orderModal.style.display = 'none';
            loadOrders();
        }
    });

    deleteOrderBtn.addEventListener('click', function () {
        if (currentOrderId && confirm('この注文を削除しますか？')) {
            deleteOrder(currentOrderId);
            orderModal.style.display = 'none';
            loadOrders();
        }
    });

    // Functions
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('nouen_orders')) || [];

        // Sort by date (newest first)
        orders.sort((a, b) => new Date(b.date) - new Date(a.date));

        renderTable(orders);
        updateStats(orders);
    }

    function renderTable(orders) {
        orderTableBody.innerHTML = '';

        if (orders.length === 0) {
            orderTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">注文データがありません</td></tr>';
            return;
        }

        orders.forEach(order => {
            const tr = document.createElement('tr');
            const date = new Date(order.date).toLocaleString('ja-JP');
            const statusClass = order.status === '発送済み' ? 'status-shipped' : 'status-ordered';

            tr.innerHTML = `
                <td>${order.id}</td>
                <td>${date}</td>
                <td>${order.customer.name}</td>
                <td>${truncate(order.items, 20)}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td>
                    <button class="btn-secondary btn-sm view-btn" data-id="${order.id}">詳細</button>
                </td>
            `;
            orderTableBody.appendChild(tr);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                openOrderModal(id);
            });
        });
    }

    function updateStats(orders) {
        const pending = orders.filter(o => o.status !== '発送済み').length;

        const today = new Date().toLocaleDateString();
        const todayCount = orders.filter(o => new Date(o.date).toLocaleDateString() === today).length;

        // Simple sales calculation (just counting items for now as we don't have structured price data in the order object yet)
        // In a real app, we would parse the items and calculate price.
        // For this demo, we'll just show "---"

        pendingOrdersCount.textContent = pending;
        todayOrdersCount.textContent = todayCount;
        totalSales.textContent = '---';
    }

    function openOrderModal(id) {
        const orders = JSON.parse(localStorage.getItem('nouen_orders')) || [];
        const order = orders.find(o => o.id === id);

        if (!order) return;

        currentOrderId = id;
        const date = new Date(order.date).toLocaleString('ja-JP');

        modalBody.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">注文ID</span>
                ${order.id}
            </div>
            <div class="detail-row">
                <span class="detail-label">注文日時</span>
                ${date}
            </div>
            <div class="detail-row">
                <span class="detail-label">ステータス</span>
                ${order.status}
            </div>
            <div class="detail-row">
                <span class="detail-label">お客様情報</span>
                ${order.customer.name} 様<br>
                ${order.customer.email}<br>
                ${order.customer.tel}<br>
                ${order.customer.address}
            </div>
            <div class="detail-row">
                <span class="detail-label">注文内容</span>
                <pre style="white-space: pre-wrap; font-family: inherit;">${order.items}</pre>
            </div>
            <div class="detail-row">
                <span class="detail-label">その他ご要望</span>
                <pre style="white-space: pre-wrap; font-family: inherit;">${order.message || 'なし'}</pre>
            </div>
        `;

        // Toggle buttons based on status
        if (order.status === '発送済み') {
            markShippedBtn.style.display = 'none';
        } else {
            markShippedBtn.style.display = 'inline-block';
        }

        orderModal.style.display = 'block';
    }

    function updateOrderStatus(id, status) {
        let orders = JSON.parse(localStorage.getItem('nouen_orders')) || [];
        const index = orders.findIndex(o => o.id === id);
        if (index !== -1) {
            orders[index].status = status;
            localStorage.setItem('nouen_orders', JSON.stringify(orders));
        }
    }

    function deleteOrder(id) {
        let orders = JSON.parse(localStorage.getItem('nouen_orders')) || [];
        orders = orders.filter(o => o.id !== id);
        localStorage.setItem('nouen_orders', JSON.stringify(orders));
    }

    function truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    }
});
