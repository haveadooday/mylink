export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export const dummyLinks: Link[] = [
  {
    id: "1",
    title: "인스타그램",
    url: "https://www.instagram.com/",
    icon: "Instagram",
  },
  {
    id: "2",
    title: "유튜브",
    url: "https://www.youtube.com/",
    icon: "Youtube",
  },
  {
    id: "3",
    title: "블로그",
    url: "https://blog.naver.com/",
  },
  {
    id: "4",
    title: "Github",
    url: "https://github.com/",
    icon: "Github",
  },
  {
    id: "5",
    title: "포트폴리오",
    url: "https://portfolio.example.com/",
  },
];
