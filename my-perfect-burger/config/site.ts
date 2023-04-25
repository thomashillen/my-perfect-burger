export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "My Perfect Burger",
  description:
    "My Perfect Burger is a burger builder app that allows you to build your own burger and order it.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    github: "https://github.com/thomashillen/my-perfect-burger",
    docs: "https://docs.echo3d.com/",
    twitter: "https://twitter.com/thomas_hillen",
    // burgerBuilder: "/burger-builder",
  },
}
