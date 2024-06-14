import { Inter } from "next/font/google";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Indonesiaparticipants() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedNamaLengkap, setSelectedNamaLengkap] = useState("");
  const [price, setPrice] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [priceIDR, setPriceIDR] = useState("");

  // Tambahkan biaya admin sebagai variabel konstan
  const adminFee = 3000; // contoh biaya admin dalam IDR

  const generateUniqueId = () => {
    const timestamp = new Date().getTime();
    return `ispc${timestamp}`;
  };

  const generateFormData = (
    selectedCategory,
    price,
    uniqueId,
    selectedNamaLengkap
  ) => {
    const formattedPrice = Math.max(Math.floor(price), 1);

    // Memecah nama lengkap menjadi array berdasarkan baris
    const names = selectedNamaLengkap.split("\n");

    // Mengambil nama pertama sebagai Nama Ketua
    const ketua = names.length > 0 ? names[0] : "";

    // Tambahkan biaya admin ke harga yang sudah diformat
    const totalPrice = formattedPrice + adminFee;

    return {
      item_details: [
        {
          id: uniqueId,
          name: selectedCategory,
          price: totalPrice.toString(),
          quantity: "1",
        },
      ],
      customer_details: {
        first_name: ketua,
        notes: "Thankyou",
      },
      transaction_details: {
        order_id: uniqueId,
        gross_amount: totalPrice.toString(),
      },
    };
  };

  const generatePaymentLink = async () => {
    const newUniqueId = generateUniqueId();
    setUniqueId(newUniqueId);

    const formData = generateFormData(
      selectedCategory,
      price,
      newUniqueId,
      selectedNamaLengkap
    );

    const secret = process.env.NEXT_PUBLIC_SECRET;
    const encodedSecret = Buffer.from(secret).toString("base64");
    const basicAuth = `Basic ${encodedSecret}`;

    const apiUrl = `${process.env.NEXT_PUBLIC_API}/v1/payment-links`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: basicAuth,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log("Response Data:", responseData);
      setPaymentUrl(responseData.payment_url);

      const buttonInput = document.querySelector("form .button input");
      buttonInput.style.display = "block";
    } catch (error) {
      console.error("Error saat mengirim permintaan:", error);
    }
  };

  useEffect(() => {
    if (selectedCategory === "ISPC Online Competition") {
      setPrice("5000");
    } else if (selectedCategory === "ISPC Offline Competition") {
      setPrice("20000");
    } else {
      setPrice("");
    }
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbwWMFqBTySdQaSaV3yv0KcPqU2qjpBblcje_4TNulzhcXMvlVlA8RcijMi_mhbjQ_oG/exec";
    const form = document.forms["regist-form"];

    if (form) {
      try {
        await fetch(scriptURL, { method: "POST", body: new FormData(form) });
        form.reset();
        setSelectedCategory("");
        setPrice("");
        setPaymentUrl("");
        setUniqueId("");
      } catch (error) {
        console.error("Error saat mengirim data:", error);
      }
    }
  };

  useEffect(() => {
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbwWMFqBTySdQaSaV3yv0KcPqU2qjpBblcje_4TNulzhcXMvlVlA8RcijMi_mhbjQ_oG/exec";

    const form = document.forms["regist-form"];

    if (form) {
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await fetch(scriptURL, { method: "POST", body: new FormData(form) });

          // Setelah berhasil mengirim data, arahkan pengguna ke halaman lain
          window.location.href = "/terimakasih"; // Gantikan dengan URL halaman sukses Anda
        } catch (error) {
          console.error("Error saat mengirim data:", error);
          // Handle error jika diperlukan
        }

        form.reset();
      };

      form.addEventListener("submit", handleSubmit);

      // Membersihkan event listener saat komponen dilepas
      return () => {
        form.removeEventListener("submit", handleSubmit);
      };
    }
  }, []);

  const fetchCurrencyExchangeRate = async () => {
    try {
      const response = await fetch(
        "https://openexchangerates.org/api/latest.json?app_id=27401c5fd1d44b1da14f869f9c865019"
      );
      const data = await response.json();
      const exchangeRate = data.rates.IDR;
      return exchangeRate;
    } catch (error) {
      console.error("Error fetching currency exchange rate:", error);
      return null;
    }
  };

  const convertToIDR = async () => {
    const exchangeRate = await fetchCurrencyExchangeRate();
    if (exchangeRate) {
      const priceInIDR = (price / 100) * exchangeRate;
      setPriceIDR(priceInIDR);
    }
  };

  useEffect(() => {
    convertToIDR();
  }, [price]);

  return (
    <section className="">
      <div className="container">
        <div className="content">
          <h1 className="sub">REGISTRATION FORM</h1>
          <h1 className="garis-bawah"></h1>
          <br></br>
          <h4>
            HELLO ISPC 2024 PARTICIPANTS, Please pay attention to the following
            information before filling out the registration form :
          </h4>
          <br />
          <p>
            1. Please fill in the required data correctly and ensure there are
            no typing errors. Also, ensure that the submitted data is final and
            has not changed.
          </p>
          <p>
            2. After ensuring the data is correct, you can click the &quot;Submit&quot;
            button. If we have received your data, there will be a green
            notification next to the &quot;Submit&quot; button.
          </p>
          <p>
            3. Notification: Data has been successfully submitted. The
            registration data will be sent to the team leaders email address,
            and the document will be validated by our team. Please be patient
            and wait up to 3 days after the registration time. The Letter of
            Acceptance (LOA) will be sent to the team leaders email address.
          </p>
          <br></br>

          <form name="regist-form">
            <h1>BIOGRAPHICAL DATA</h1>
            <h1 className="garis-bawah"></h1>
            <div className="user-details">
              <div className="input-box">
                <option value="International Participant">
                  Participant Category
                </option>
                <input
                  type="text"
                  id="CATEGORY_PARTICIPANT"
                  name="CATEGORY_PARTICIPANT"
                  className="form-control"
                  placeholder="Choose Categories Participant"
                  value="INTERNATIONAL PARTICIPANT"
                  readOnly
                />
              </div>
            </div>

            <div className="user-details">
              <div className="input-box">
                <label htmlFor="FULL_NAME" className="form-label">
                  Leader & Team Members Names
                </label>
                <p>
                  Notes: Enter the leaders name and team members names with
                  the leaders name first, in the following format:
                </p>
                <h6>Kamal Putra</h6>
                <h6>Ranu Ramadhan</h6>
                <h6>Irsyad Zaidan</h6>
                <textarea
                  type="text"
                  id="FULL_NAME"
                  name="FULL_NAME"
                  className="form-control"
                  placeholder="Enter Leader & Members' Names"
                  required
                  value={selectedNamaLengkap}
                  onChange={(e) => setSelectedNamaLengkap(e.target.value)}
                ></textarea>
              </div>
              <div className="input-box">
                <label htmlFor="COUNTRY_ORIGIN" className="form-label">
                  Country of Origin
                </label>
                <input
                  type="text"
                  id="COUNTRY_ORIGIN"
                  name="COUNTRY_ORIGIN"
                  className="form-control"
                  placeholder="Enter Country of Origin"
                  required
                />
              </div>
              <div className="input-box">
                <label htmlFor="UNIVERSITY" className="form-label">
                  University Name
                </label>
                <input
                  type="text"
                  id="UNIVERSITY"
                  name="UNIVERSITY"
                  className="form-control"
                  placeholder="Enter University Name"
                  required
                />
              </div>
              <div className="input-box">
                <label htmlFor="CATEGORY" className="form-label">
                  Competition Category
                </label>
                <select
                  id="CATEGORY"
                  name="CATEGORY"
                  className="form-control"
                  placeholder="Select Competition Category"
                  required
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="" disabled>
                    Choose Competition Category
                  </option>
                  <option value="ISPC Online Competition">
                    ISPC Online Competition
                  </option>
                  <option value="ISPC Offline Competition">
                    ISPC Offline Competition
                  </option>
                </select>
              </div>
              <div className="input-box">
                <label htmlFor="PHONE" className="form-label">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  id="PHONE"
                  name="PHONE"
                  className="form-control"
                  placeholder="Enter WhatsApp Number"
                  required
                />
              </div>
              <div className="input-box">
                <label htmlFor="EMAIL" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="EMAIL"
                  name="EMAIL"
                  className="form-control"
                  placeholder="Enter Email Address"
                  required
                />
              </div>
              <div className="input-box">
                <label htmlFor="RE_EMAIL" className="form-label">
                  Confirm Email Address
                </label>
                <input
                  type="email"
                  id="RE_EMAIL"
                  name="RE_EMAIL"
                  className="form-control"
                  placeholder="Re-enter Email Address"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="NAME_TRANSFER" className="form-label">
                Transfer Name
              </label>
              <input
                type="text"
                id="NAME_TRANSFER"
                name="NAME_TRANSFER"
                className="form-control"
                placeholder="Enter Transfer Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="TELLER_TRANSFER" className="form-label">
                Transfer Bank
              </label>
              <input
                type="text"
                id="TELLER_TRANSFER"
                name="TELLER_TRANSFER"
                className="form-control"
                placeholder="Enter Transfer Bank"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="BANK_ACCOUNT" className="form-label">
                Bank Account Number
              </label>
              <input
                type="text"
                id="BANK_ACCOUNT"
                name="BANK_ACCOUNT"
                className="form-control"
                placeholder="Enter Bank Account Number"
                required
              />
            </div>
            <div className="button">
              <input
                type="submit"
                value="Submit"
                onClick={handleSubmitForm}
              />
              <button type="button" onClick={generatePaymentLink}>
                Generate Payment Link
              </button>
              {paymentUrl && (
                <div>
                  <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
                    Proceed to Payment
                  </a>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
