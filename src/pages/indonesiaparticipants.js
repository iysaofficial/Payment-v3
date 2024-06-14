import { Inter } from "next/font/google";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Indonesiaparticipants() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedNamaLengkap, setSelectedNamaLengkap] = useState("");
  const [price, setPrice] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [uniqueId, setUniqueId] = useState(""); // Mengatur uniqueId ke state
  const [phone, setPhone] = useState(""); // Menambah state untuk phone (Nomor WhatsApp)
  const adminFee = 5000; // Biaya admin tetap sebesar Rp10.000

  const generateUniqueId = () => {
    const timestamp = new Date().getTime();
    return `ispc${timestamp}`;
  };

  const generateFormData = (
    selectedCategory,
    price,
    uniqueId,
    selectedNamaLengkap,
    phone
  ) => {
    const formattedPrice = Math.max(Math.floor(price), 1);
    const totalPrice = formattedPrice + adminFee;

    // Memecah nama lengkap menjadi array berdasarkan baris
    const names = selectedNamaLengkap.split("\n");

    // Mengambil nama pertama sebagai Nama Ketua
    const ketua = names.length > 0 ? names[0] : "";

    return {
      item_details: [
        {
          id: uniqueId,
          name: selectedCategory,
          price: formattedPrice.toString(),
          quantity: "1",
        },
        {
          id: `${uniqueId}-admin`,
          name: "Admin Fee",
          price: adminFee.toString(),
          quantity: "1",
        },
      ],
      customer_details: {
        first_name: ketua, // Menggunakan nama pertama sebagai Nama Ketua
        phone: phone,
        notes: "Thankyou",
      },
      transaction_details: {
        order_id: uniqueId,
        gross_amount: totalPrice.toString(), // Menggunakan total harga
      },
    };
  };

  const generatePaymentLink = async () => {
    if (
        selectedCategory !== "ISPC Online Competition" &&
        selectedCategory !== "ISPC Offline Competition"
    ) {
        alert(
            "Anda harus memilih kategori 'Kompetisi Online' atau 'Kompetisi Offline' untuk membuat tautan pembayaran."
        );
        return;
    }

    if (!selectedNamaLengkap) {
        alert("Nama lengkap harus diisi untuk membuat tautan pembayaran.");
        return;
    }

    if (!phone) {
        alert("Nomor telepon ketua tim harus diisi untuk membuat tautan pembayaran.");
        return; // Menghentikan eksekusi fungsi jika phone belum diisi
    } else if (phone.length < 5 || phone.length > 20) {
        alert("Nomor telepon harus memiliki panjang antara 5 hingga 20 karakter.");
        return; // Menghentikan eksekusi fungsi jika panjang phone tidak sesuai
    }

    const newUniqueId = generateUniqueId(); // Menghasilkan uniqueId baru
    setUniqueId(newUniqueId); // Menyimpan uniqueId baru ke state

    const formData = generateFormData(
        selectedCategory,
        price,
        newUniqueId,
        selectedNamaLengkap,
        phone
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
      setPrice("100000");
    } else if (selectedCategory === "ISPC Offline Competition") {
      setPrice("200000");
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

  return (
    <section className="">
      <div className="container">
        <div className="content">
          <h1 className="sub">FORMULIR PENDAFTARAN</h1>
          <h1 className="garis-bawah"></h1>
          <br></br>
          <h4>
            HALLO PESERTA ISPC 2024, Mohon perhatikan informasi berikut ini
            sebelum mengisi formulir pendaftaran :
          </h4>
          <br />
          <p>
            1. Mohon mengisi data yang diperlukan dengan benar dan memastikan
            tidak ada kesalahan penulisan. Pastikan juga bahwa data yang dikirim
            sudah final dan tidak mengalami perubahan.
          </p>
          <p>
            2. Setelah memastikan data sudah benar, Anda dapat mengklik tombol
            &quot;Kirim&quot;. Jika kami telah menerima data Anda, akan ada
            notifikasi berwarna hijau di sebelah tombol &quot;Kirim&quot;.
          </p>
          <p>
            3. Notifikasi: Data telah berhasil terkirim data registrasi akan
            dikirimkan ke alamat email ketua tim, dan berkas akan divalidasi
            oleh tim kami.Mohon bersabar dan tunggu hingga 3 hari setelah waktu
            pendaftaran. Surat Penerimaan (LOA) akan kami kirimkan ke alamat
            email ketua tim.
          </p>
          <br></br>

          <form name="regist-form">
            <h1>BIODATA</h1>
            <h1 className="garis-bawah"></h1>
            <div className="user-details">
              <div className="input-box">
                <option value="Peserta Indonesia">Kategori Peserta</option>
                <input
                  type="text"
                  id="CATEGORY_PARTICIPANT"
                  name="CATEGORY_PARTICIPANT"
                  className="form-control"
                  placeholder="Choose Categories Participant"
                  value="PESERTA INDONESIA"
                  readOnly
                />
              </div>
            </div>

            <div className="user-details">
              <div className="input-box">
                <label htmlFor="NAMA_LENGKAP" className="form-label">
                  Nama Ketua & Anggota Tim
                </label>
                <p>
                  Notes : Masukan nama ketua dan anggota tim dengan nama ketua
                  tim diawal, dengan format seperti berikut :
                </p>
                <h6>Kamal Putra</h6>
                <h6>Ranu Ramadhan</h6>
                <h6>Irsyad Zaidan</h6>
                <textarea
                  type="text"
                  id="NAMA_LENGKAP"
                  name="NAMA_LENGKAP"
                  className="form-control"
                  placeholder="Masukan Nama Ketua & Anggota"
                  required
                  value={selectedNamaLengkap}
                  onChange={(e) => setSelectedNamaLengkap(e.target.value)} // Menambahkan handler onChange
                ></textarea>
              </div>
              <div class="input-box">
                <label htmlFor="LEADER_WHATSAPP" className="form-label">
                  Nomor WhatsApp Ketua Tim
                </label>
                <p>Harap tulis dengan kode telepon, contoh : +6281770914129</p>
                <p>
                  Notes : Dimohon untuk mengisi nomor ketua tim dengan benar,
                  untuk dimasukan kedalam group
                </p>
                <input
                  type="number"
                  id="LEADER_WHATSAPP"
                  name="LEADER_WHATSAPP"
                  class="form-control"
                  placeholder="Masukan Nomor WhatsApp Ketua Tim"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)} // Menambahkan handler onChange
                />
              </div>
              <div class="input-box">
                <label for="LEADER_EMAIL" class="form-label">
                  Alamat Email Ketua Tim
                </label>
                <p>
                  Notes : Dimohon untuk mengisi email dengan benar, pengiriman
                  LOA akan dikirim melalui email address ketua tim yang di isi.
                </p>
                <input
                  type="email"
                  id="LEADER_EMAIL"
                  name="LEADER_EMAIL"
                  class="form-control"
                  placeholder="Masukan Alamat Email Ketua Tim"
                  required
                />
              </div>
              <div class="input-box">
                <label for="NISN_NIM" class="form-label">
                  NISN / NIM Ketua & Anggota Tim
                </label>
                <p>
                  Notes : Masukan NISN / NIM dengan sesuai urutan nama ketua dan
                  anggota tim, dengan format seperti berikut :
                </p>
                <h6>231700</h6>
                <h6>241700</h6>
                <h6>251700</h6>
                <textarea
                  type="text"
                  id="NISN_NIM"
                  name="NISN_NIM"
                  class="form-control"
                  placeholder="Masukan NISN / NIM Ketua & Anggota Tim"
                  required
                ></textarea>
              </div>
            </div>

            {/* DATA SEKOLAH START */}
            {/* DATA SEKOLAH START */}
            <h1>DATA SEKOLAH</h1>
            <h1 className="garis-bawah"></h1>
            <div className="user-details">
              <div className="input-box">
                <label htmlFor="NAMA_SEKOLAH" className="form-label">
                  Nama Sekolah/Universitas
                </label>
                <p>
                  Notes : Masukan nama sekolah dengan format sesuai urutan nama
                  ketua dan anggota tim asal sekolah masing - masing, dengan
                  format seperti berikut :
                </p>
                <h6>SMA CERIA</h6>
                <h6>SMA BAHAGIA</h6>
                <h6>SMA TADIKA MESRA</h6>
                <textarea
                  type="text"
                  id="NAMA_SEKOLAH"
                  name="NAMA_SEKOLAH"
                  className="form-control"
                  placeholder="Masukan Nama Sekolah/Universitas Anda"
                  required
                ></textarea>
              </div>
              <div class="input-box">
                <label for="NPSN" class="form-label">
                  Nomor Pokok Sekolah Nasional (NPSN)
                </label>
                <p>
                  Notes : Masukan NPSN jika masi bersekolah dengan sesuai urutan
                  nama ketua dan anggota tim, dengan format seperti berikut :
                </p>
                <h6>1201301</h6>
                <h6>1302402</h6>
                <h6>1020100</h6>
                <textarea
                  type="number"
                  id="NPSN"
                  name="NPSN"
                  class="form-control"
                  placeholder="Masukan Nomor Pokok Sekolah Nasional (NPSN)"
                ></textarea>
              </div>
              <div class="input-box">
                <label for="GRADE" class="form-label">
                  Jenjang Pendidikan{" "}
                </label>
                <select
                  type="text"
                  id="GRADE"
                  name="GRADE"
                  class="form-control"
                  placeholder="Choose Grade"
                  required
                >
                  <option value="">--Pilih Jenjang Pendidikan Anda--</option>
                  <option value="Sekolah Dasar">Sekolah Dasar</option>
                  <option value="Sekolah Menengah Pertama">
                    Sekolah Menengah Pertama
                  </option>
                  <option value="Sekolah Menengah Atas">
                    Sekolah Menengah Atas
                  </option>
                  <option value="Universitas">Universitas</option>
                </select>
              </div>
              <div class="input-box">
                <label for="PROVINCE" class="form-label">
                  Provinsi
                </label>
                <input
                  type="text"
                  id="PROVINCE"
                  name="PROVINCE"
                  class="form-control"
                  placeholder="Masukan Provinsi Anda"
                  required
                />
              </div>
            </div>
            {/* DATA SEKOLAH END */}
            {/* DATA SEKOLAH END */}

            {/* DATA PEMBIMBING START */}
            {/* DATA PEMBIMBING START */}
            <h1>DATA PEMBIMBING</h1>
            <h1 className="garis-bawah"></h1>
            <div className="user-details">
              <div class="input-box">
                <label for="NAME_SUPERVISOR" class="form-label">
                  Nama Guru/Pembimbing
                </label>
                <textarea
                  type="text"
                  id="NAME_SUPERVISOR"
                  name="NAME_SUPERVISOR"
                  class="form-control"
                  placeholder="Masukan Nama Guru/Pembimbing"
                  required
                ></textarea>
              </div>

              <div class="input-box">
                <label for="WHATSAPP_NUMBER_SUPERVISOR" class="form-label">
                  Nomor WhatsApp Guru/Pembimbing
                </label>
                <p>
                  Mohon tuliskan dengan kode telepon, contoh : +628177091xxxx
                </p>
                <input
                  type="number"
                  id="WHATSAPP_NUMBER_SUPERVISOR"
                  name="WHATSAPP_NUMBER_SUPERVISOR"
                  class="form-control"
                  placeholder="Masukan Nomor WhatsApp Guru/Pembimbing"
                  required
                />
              </div>

              <div class="input-box">
                <label for="EMAIL_TEACHER_SUPERVISOR" class="form-label">
                  Alamat Email Guru/Pembimbing
                </label>
                <input
                  type="email"
                  id="EMAIL_TEACHER_SUPERVISOR"
                  name="EMAIL_TEACHER_SUPERVISOR"
                  class="form-control"
                  placeholder="Alamat Email Guru/Pembimbing"
                  required
                />
              </div>
            </div>
            {/* DATA PEMBIMBING END */}
            {/* DATA PEMBIMBING END */}

            {/* INVOICE START */}
            {/* INVOICE START */}
            <div className="">
              <h1>INVOICE</h1>
              <h1 className="garis-bawah"></h1>
            </div>
            <div className="user-details">
              <div className="input-box">
                <label html="CATEGORY_COMPETITION" className="form-label">
                  Kategori Kompetisi
                </label>
                <select
                  type="text"
                  id="CATEGORY_COMPETITION"
                  name="CATEGORY_COMPETITION"
                  className="form-control"
                  placeholder="Choose Category Competition"
                  required
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                >
                  <option value="">--Pilih Kategori Kompetisi--</option>
                  <option value="ISPC Online Competition">
                    Kompetisi Online
                  </option>
                  <option value="ISPC Offline Competition">
                    Kompetisi Offline
                  </option>
                </select>
              </div>
              <div className="mx-auto">
                <p className="fw-bold">
                  *wajib di klik ketika sudah memilih kategori kompetisi
                </p>
                <button
                  className="btn btn-action"
                  onClick={(e) => generatePaymentLink(e)}
                  disabled={
                    selectedCategory !== "ISPC Online Competition" &&
                    selectedCategory !== "ISPC Offline Competition"
                  }
                >
                  Buat Tautan Pembayaran
                </button>
              </div>
            </div>
            <div className="user-details">
              <div className="input-box">
                <label className="form-label">
                  Biaya yang harus dibayarkan sebesar{" "}
                  <span className="fw-bold">(Belum Termasuk biaya Admin)</span>
                </label>
                <input
                  type="text"
                  id="TOTAL_AMOUNT"
                  name="TOTAL_AMOUNT"
                  className="form-control"
                  placeholder="Total Biaya"
                  value={
                    price
                      ? (price / 1000).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 3,
                        })
                      : ""
                  }
                  readOnly
                />
              </div>
              <div className="input-box">
                <label className="form-label">INVOICE ID</label>
                <input
                  type="text"
                  id="ORDER_ID"
                  name="ORDER_ID"
                  className="form-control"
                  placeholder="ID PEMBAYARAN"
                  value={uniqueId}
                  readOnly
                />
              </div>
              <div className="input-box ">
                <label className="form-label">Link Invoice</label>
                <input
                  type="text"
                  id="LINK_INVOICE"
                  name="LINK_INVOICE"
                  className="form-control"
                  placeholder="Link Pembayaran"
                  value={paymentUrl}
                />
              </div>
            </div>
            {/* INVOICE END */}
            {/* INVOICE END */}

            {/* DETAIL PROJECT START */}
            {/* DETAIL PROJECT START */}
            <div className="">
              <h1>DETAIL PROYEK</h1>
              <h1 className="garis-bawah"></h1>
            </div>
            <div className="user-details">
              <div class="input-box">
                <label for="PROJECT_TITLE" class="form-label">
                  Judul Proyek
                </label>
                <p>
                  Notes : Dimohon untuk mengisi data judul dengan BENAR, data
                  yang masuk sudah tidak bisa ada perubahan!
                </p>
                <textarea
                  type="text"
                  id="PROJECT_TITLE"
                  name="PROJECT_TITLE"
                  class="form-control"
                  placeholder="Masukkan Judul Proyek Anda"
                  required
                ></textarea>
              </div>
              <div class="input-box">
                <label for="CATEGORIES" class="form-label">
                  Kategori
                </label>
                <select
                  type="text"
                  id="CATEGORIES"
                  name="CATEGORIES"
                  class="form-control"
                  placeholder="--Choose-- "
                  required
                >
                  <option value="">--Pilih Kategori--</option>
                  <option value="Waste treatment">Waste treatment</option>
                  <option value="IoT and Its Applications">
                    IoT and Its Applications
                  </option>
                  <option value="Functional Food">Functional Food</option>
                  <option value="Energy">Energy</option>
                  <option value="Research on Children with Special Needs">
                    Research on Children with Special Needs
                  </option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                </select>
              </div>
              <div class="input-box">
                <label for="YES_NO" class="form-label">
                  Apakah judul proyek pernah berpartisipasi dalam kompetisi
                  penemuan dan inovasi sebelumnya?
                </label>
                <select
                  type="text"
                  id="YES_NO"
                  name="YES_NO"
                  class="form-control"
                  placeholder="--Choose Information Resources-- "
                  required
                >
                  <option>--Pilih--</option>
                  <option value="Yes">Iya</option>
                  <option value="No">Tidak</option>
                </select>
              </div>

              <div class="input-box">
                <label for="JUDUL_PERNAH_BERPATISIPASI" class="form-label">
                  Jika judul proyek pernah mengikuti kompetisi invensi dan
                  inovasi lainnya, mohon tuliskan nama kompetisinya
                </label>
                <textarea
                  type="text"
                  id="JUDUL_PERNAH_BERPATISIPASI"
                  name="JUDUL_PERNAH_BERPATISIPASI"
                  class="form-control"
                  placeholder="Masukan Nama Kompetisinya"
                ></textarea>
                <div class="mt-5" id="form_alerts"></div>
              </div>
            </div>
            {/* DETAIL PROJECT END */}
            {/* DETAIL PROJECT END */}

            {/* GENERAL INFORMATION START */}
            {/* GENERAL INFORMATION START */}
            <div className="">
              <h1>INFORMASI UMUM</h1>
              <h1 className="garis-bawah"></h1>
            </div>
            <div className="user-details">
              <div class="input-box">
                <label for="COMPLETE_ADDRESS" class="form-label">
                  Alamat Lengkap
                </label>
                <p>
                  Mohon tuliskan alamat lengkap (Nama Jalan, Nomor Rumah, RT&RW,
                  Kecamatan, Kabupaten, Kota, Provinsi, Kode Pos)
                </p>
                <textarea
                  type="text"
                  id="COMPLETE_ADDRESS"
                  name="COMPLETE_ADDRESS"
                  class="form-control"
                  placeholder="Masukan Alamat Lengkap Anda"
                  required
                ></textarea>
              </div>
              <div class="input-box">
                <label for="INFORMATION_RESOURCES" class="form-label">
                  Sumber Informasi Kompetisi ISPC 2024
                </label>
                <select
                  type="text"
                  id="INFORMATION_RESOURCES"
                  name="INFORMATION_RESOURCES"
                  class="form-control"
                  placeholder="--Choose Information Resources-- "
                  required
                >
                  <option value="">--Pilih Sumber Informasi--</option>
                  <option value="IYSA Instagram">IYSA Instagram</option>
                  <option value="ISPC Instagram">ISPC Instagram</option>
                  <option value="Pembimbing/Sekolah">Pembimbing/Sekolah</option>
                  <option value="IYSA FaceBook">IYSA FaceBook</option>
                  <option value="IYSA Linkedin">IYSA Linkedin</option>
                  <option value="IYSA Website">IYSA Website</option>
                  <option value="ISPC Website">ISPC Website</option>
                  <option value="IYSA Email">IYSA Email</option>
                  <option value="ISPC Email">ISPC Email</option>
                  <option value="Acara Sebelumnya">Acara Sebelumnya</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div class="input-box">
                <label for="FILE" class="form-label">
                  Jika Anda mendapatkan pendaftaran gratis dari acara sebelumnya
                  atau kegiatan kunjungan sekolah sebelumnya, harap lampirkan
                  bukti dokumentasi{" "}
                </label>
                <input
                  type="url"
                  id="FILE"
                  name="FILE"
                  class="form-control"
                  placeholder="Upload Link File Drive"
                />
              </div>
            </div>
            {/* GENERAL INFORMATION END */}
            {/* GENERAL INFORMATION END */}

            <div className="button">
              <input type="submit" value="Kirim" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
