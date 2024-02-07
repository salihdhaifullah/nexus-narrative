function getTheme(){
    const theme = localStorage.getItem("theme");
    if (theme) return theme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return "dark"
    return "light"
}

const theme = getTheme()
localStorage.setItem("theme", theme)

if (theme === "dark") document.documentElement.classList.add('dark')
else document.documentElement.classList.remove('dark')

function HandelTheme(theme) {
    localStorage.setItem("theme", theme)
    if (theme === "dark") document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    theme = theme;
}
