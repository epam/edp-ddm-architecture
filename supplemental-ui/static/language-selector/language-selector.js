document.addEventListener('DOMContentLoaded', function() {
    var t, e = document.querySelector(".page-languages .language-menu-toggle");
    e && (t = document.querySelector(".page-languages"),
        e.addEventListener("click", function(e) {
            t.classList.toggle("is-active"),
                e.stopPropagation()
        }),
        document.documentElement.addEventListener("click", function() {
            t.classList.remove("is-active")
        }))
});