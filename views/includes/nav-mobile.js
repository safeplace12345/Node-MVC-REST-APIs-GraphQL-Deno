
    <nav class="mobile-nav">
    <ul class="mobile-nav__item-list">
        <li class="mobile-nav__item">
            <a class="<%= path === '/' ? 'active' : '' %>" href="/clients/">Shop</a>
        </li>
        <li class="mobile-nav__item">
            <a class="<%= path === '/products' ? 'active' : '' %>" href="/clients/index/?name=">Home</a>
        </li>
        <% if (isAuthenticated) { %>
            <li class="mobile-nav__item">
                <a class="<%= path === '/cart' ? 'active' : '' %>" href="/clients/cart?name=">Cart</a>
            </li>
            <li class="mobile-nav__item">
                <a class="<%= path === '/clients/orders' ? 'active' : '' %>" href="/orders">Orders</a>
            </li>
            <li class="mobile-nav__item">
                <a class="<%= path === '/admin/add-product' ? 'active' : '' %>" href="/admin/add-product">Add Product
                </a>
            </li>
            <li class="mobile-nav__item">
                <a class="<%= path === '/admin/products' ? 'active' : '' %>" href="/admin/products">Admin Products
                </a>
            </li>
        <% } %>
        <% if (!isAuthenticated) { %>
            <li class="mobile-nav__item">
                <a class="<%= path === '/login' ? 'active' : '' %>" href="/login">Login</a>
            </li>
            <li class="mobile-nav__item">
                <a class="<%= path === '/signup' ? 'active' : '' %>" href="/signup">Signup</a>
            </li>
        <% } else { %>
            <li class="mobile-nav__item">
                <form action="/logout" method="post">

                    <input type="text" value="<%=csrfToken%>" style="visibility: hidden;" name="_csrf">
                    <button type="submit">Logout</button>
                </form>
            </li>
        <% } %>
    </ul>
  </nav>