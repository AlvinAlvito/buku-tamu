import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import Button from "../ui/button/Button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router";

const slides = [
    {
        image: "https://asset.kompas.com/crops/ZP0RicKY7Jeq7ytNnFxyL0URiWI=/98x0:942x563/750x500/data/photo/2020/02/06/5e3b934a16c7e.jpg",
        title: "Inovasi Teknologi",
        description: "Temukan solusi masa depan dengan teknologi terbaru.",
        link: "/tutorial"
    },
    {
        image: "https://png.pngtree.com/thumb_back/fh260/background/20230407/pngtree-cityscape-with-the-eiffel-tower-in-paris-photo-image_2288903.jpg",
        title: "Pendidikan Modern",
        description: "Pendidikan berbasis digital untuk generasi masa depan.",
        link: "/inovasi"
    },
    {
        image: "https://media.istockphoto.com/id/1185953092/id/foto/daya-tarik-utama-paris-dan-seluruh-eropa-adalah-menara-eiffel-di-bawah-sinar-matahari-terbenam.jpg?s=612x612&w=0&k=20&c=jdhhnTt_XGcv5x69rR8bv3tEbB-QsXMGeu3-5Za9TRk=",
        title: "Alam yang Indah",
        description: "Menikmati keindahan alam secara visual.",
        link: "/inovasi"
    },
];
export default function Slider() {
    return (
         <div className="w-full h-full">
            <Swiper
                modules={[Pagination, Autoplay, EffectFade]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                loop={true}
                spaceBetween={30}
                effect="fade"
                className="rounded-2xl overflow-hidden shadow-xl"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative h-[300px] md:h-[400px] w-full">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover brightness-75"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                                <h2 className="text-white text-2xl md:text-3xl font-semibold drop-shadow-md">
                                    {slide.title}
                                </h2>
                                <p className="text-white text-base md:text-lg mt-2 drop-shadow-sm max-w-xl">
                                    {slide.description}
                                </p>
                                <Link className="mt-4" to={`/mahasiswa${slide.link}`}>
                                    <Button size="sm" variant="outline" className="w-full">
                                        <ExternalLink className="w-4 h-4" /> Lihat Profil
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
