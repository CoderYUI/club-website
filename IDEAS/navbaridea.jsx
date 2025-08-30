import { useEffect, useRef, useState } from "react";
import { contacts, socials } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-scroll";
import MusicBox from "./MusicBox";

const Navbar = () => {
  {
    /*so now when route change it will not render again and again*/
  }
  const navRef = useRef(null);
  {
    /*to animate each div with index*/
  }
  const linksRef = useRef([]);
  const contactRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const tl = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const iconTL = useRef(null);
  const burgerRef = useRef(null);

  const isOpenRef = useRef(isOpen);

  const [showBurger, setShowBurger] = useState(true);

  useGSAP(() => {
    gsap.set(navRef.current, { xPercent: 100 });

    gsap.set([gsap.utils.toArray(linksRef.current), contactRef.current], {
      autoAlpha: 0,
      x: -20,
    });

    tl.current = gsap
      .timeline({ paused: true })
      .to(navRef.current, {
        xPercent: 0,
        duration: 1,
        ease: "power3.out",
      })
      .to(
        gsap.utils.toArray(linksRef.current),
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
        },
        "<+0.6"
      )
      .to(
        contactRef.current,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "<+0.6"
      );

    iconTL.current = gsap
      .timeline({
        paused: true,
      })

      .to(topLineRef.current, {
        rotation: 45,
        y: 4.5,
        duration: 0.8,
        ease: "power2.out",
      })
      .to(
        bottomLineRef.current,
        {
          rotation: -45,
          y: -4.5,
          duration: 0.8,
          ease: "power2.out",
        },
        "<"
      );
  }, []);

  {
    /*
    # Why [] creates problems:-
    The effect runs only once after the first render 
    (because the dependency array is empty)
    
    The function handleScroll is created during that first render.

    At that moment, isOpen was false.

    Closures in JavaScript mean: handleScroll will remember 
    the variables as they were when it was created.
    
    So even if React re-renders and isOpen becomes true, 
    the handleScroll in memory still sees the old false.



    # Why [isOpen] fixes it :-
    Now, every time isOpen changes, React cleans up the 
    old effect and sets up a new one.

    That means a new handleScroll closure is created, 
    which now “sees” the latest isOpen.



    # Why the ref version is different:-

    The scroll listener is attached only once ([]).

    Inside the listener, we don't use the stale isOpen from closure 
    instead we read isOpenRef.current.

    isOpenRef.current is updated on every render where isOpen changes.



    # main difference:-

    [isOpen] version -> 
    listener is removed and re-added every time isOpen changes.
    Fine if toggling rarely, but unnecessary work if isOpen changes often.

    ref version -> 
    listener is added once and just reads from ref.
  */
  }

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentScrollStatus =
        currentScrollY <= lastScrollY || currentScrollY <= 0;
      if (!isOpenRef.current) {
        setShowBurger(currentScrollStatus);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  {
    /*
      [] means run this only once

      If you removed the [] here, your handleScroll function would be 
      re-added every time state changes (like isOpen or showBurger), 
      which would slow things down and cause multiple triggers 
      for each scroll.
    */
  }

  const toggleMenu = () => {
    if (isOpen) {
      tl.current.reverse();
      iconTL.current.reverse();
    } else {
      tl.current.play();
      iconTL.current.play();
    }

    setIsOpen(!isOpen);
  };

  const burgerColor = (hovering) => {
    if (isOpen) {
      gsap.to([topLineRef.current, bottomLineRef.current], {
        background: hovering ? "white" : "rgba(255, 255, 255, 0.8)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed z-50 flex flex-col justify-between w-[105vw] h-[100vh] px-5 sm:px-10 uppercase bg-black text-white/80 py-20 gap-y-10 md:w-1/2 md:left-1/2"
      >
        {/*text-white/80 = 80% opacity */}
        <div className="flex flex-col text-3xl gap-y-2 md:text-4xl lg:text-5xl">
          {/*array*/}
          {/*JS .map() provide index and every array element/section is taken at a time*/}
          {["home", "services", "about", "work", "contact"].map(
            (section, index) => {
              return (
                <div
                  key={index}
                  ref={(el) => {
                    {
                      /*

                        this is useful in the scrollIntoView() function:- 
                        linksRef.current[0] = <div>home</div>
                        linksRef.current[1] = <div>services</div> 

                        this is another way to use useRef
                      */
                    }
                    return (linksRef.current[index] = el);
                  }}
                >
                  {/*
                    el is the current div and we are storing the current element into linksRef array
                  */}

                  {/*
                    we are going to replace the <a></a> tag with
                    react-scroll "link" tag to smooth scroll
                  
                    now we will also not use "href = {`#${section}`}"
                    instead we will use "to = {`${section}`}"
                  */}
                  <Link
                    className="transition-all duration-300 cursor-pointer hover:text-white"
                    to={`${section}`}
                    smooth
                    offset={0}
                    duration={2000}
                    onClick={toggleMenu}
                  >
                    {section}
                  </Link>
                </div>
              );
            }
          )}
        </div>
        <div
          ref={contactRef}
          className="flex flex-col flex-wrap justify-between gap-8 md:flex-row"
        >
          <div>
            <p className="tracking-wider text-white/50">E-mail</p>
            <a
              className="tracking-widest text-sm lg:text-xl lowercase text-pretty cursor-pointer transition-all duration-300  hover:text-white"
              href={contacts[0].href}
            >
              {contacts[0].text}
            </a>
          </div>
          <div>
            <p className="tracking-wider text-white/50">Social Media</p>
            <div className="flex flex-col flex-wrap gap-x-4 md:flex-row">
              {socials.map((social, index) => {
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    className="tracking-widest leading-loose text-sm lg:text-xl uppercase text-pretty transition-all duration-300 cursor-pointer hover:text-white"
                  >
                    {"{ "}
                    {social.name}
                    {" }"}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Music Burger  */}
      <MusicBox showMusicBurger={showBurger} />

      {/* Navbar Burger */}
      <div
        className="fixed z-50 flex flex-col items-center justify-center gap-2 transition-all duration-300 bg-black rounded-full cursor-pointer w-14 h-14 md:w-20 md:h-20 top-4 right-5 sm:right-10 "
        onClick={toggleMenu}
        onMouseEnter={() => burgerColor(true)}
        onMouseLeave={() => burgerColor(false)}
        ref={burgerRef}
        style={
          showBurger
            ? { clipPath: "circle(50% at 50% 50%)" }
            : { clipPath: "circle(0% at 50% 50%)" }
        }
      >
        <span
          ref={topLineRef}
          className="block w-8 h-0.5 bg-white rounded-full origin-center"
        ></span>
        <span
          ref={bottomLineRef}
          className="block w-8 h-0.5 bg-white rounded-full origin-center"
        ></span>
      </div>
    </>
  );
};

export default Navbar;
