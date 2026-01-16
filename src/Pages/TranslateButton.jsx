import { useEffect, useState } from "react";

const TranslateButton = () => {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        setReady(true);
        clearInterval(check);
      }
    }, 500);
  }, []);

  const changeLang = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (!select) return;

    select.value = lang;
    select.dispatchEvent(new Event("change"));
    setOpen(false);
  };

  if (!ready) return null; // wait until google loads

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          right: "15px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 9999
        }}
        className="bg-blue-600 text-white px-3 py-2 rounded-l-lg shadow-lg"
      >
        🌐
      </button>

      {/* Language Panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            right: "70px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 9999
          }}
          className="bg-white rounded-xl shadow-xl p-3 flex flex-col gap-2"
        >
          <button onClick={() => changeLang("en")}>English</button>
          <button onClick={() => changeLang("am")}>አማርኛ</button>
          <button onClick={() => changeLang("om")}>Afaan Oromo</button>
        </div>
      )}
    </>
  );
};

export default TranslateButton;
