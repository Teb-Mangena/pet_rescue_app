import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  Search,
  Heart,
  ArrowRightLeft,
  MessageSquare,
  Users,
  ImageOff,
  MapPin,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
import { useIncidents } from "../../hooks/useIncidents";
import { useAuthStore } from "../../store/useAuthStore";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

export default function Member_Dashboard() {
  const { user } = useAuthStore();
  const { missingPetsQuery, foundPetsQuery, myHandoversQuery } = useIncidents();

  const isLoading =
    missingPetsQuery.isLoading ||
    foundPetsQuery.isLoading ||
    myHandoversQuery.isLoading;

  // Calculate user's specific stats
  const stats = useMemo(() => {
    const myReports =
      foundPetsQuery.data?.filter(
        (p) => p.report_info.finder_id === user?.person_id,
      ) || [];

    return {
      missing: missingPetsQuery.data?.length || 0,
      myReports: myReports.length,
      myHandovers: myHandoversQuery.data?.length || 0,
    };
  }, [missingPetsQuery.data, foundPetsQuery.data, myHandoversQuery.data, user]);

  if (isLoading) return <PageLoader />;

  // Get top 3 recent missing pets for a quick preview
  const recentMissing = missingPetsQuery.data?.slice(0, 3) || [];

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden py-12 px-6">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-20 right-12 w-12 h-12 text-moss/15 rotate-[25deg]" />
        <PawPrint className="absolute top-40 left-16 w-8 h-8 text-amber/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
      </div>

      <div className="relative max-w-[1200px] mx-auto">
        {/* ============ HEADER ============ */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-bone text-[11px] font-bold uppercase tracking-widest mb-6">
            <Users className="w-3.5 h-3.5" />
            Community Member
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em]">
            Hey {user?.first_name || "there"},
            <br />
            <span className="text-moss">let's help them get home.</span>
          </h1>
          <p className="mt-4 text-lg text-stone max-w-xl">
            Every sighting counts. Keep an eye on local missing pets, report
            those you find, and track your handovers to the SPCA.
          </p>
        </motion.div>

        {/* ============ STATS GRID ============ */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {/* Missing Pets */}
          <div className="p-6 rounded-[2rem] bg-burnt/5 border border-burnt/10 flex flex-col">
            <div className="flex items-start justify-between">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-burnt/10 text-burnt">
                <Search className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <div className="font-display font-black text-4xl tracking-tight text-burnt">
                {stats.missing}
              </div>
              <div className="text-sm font-medium mt-1">
                Missing Pets Nearby
              </div>
            </div>
          </div>

          {/* My Reports */}
          <div className="p-6 rounded-[2rem] bg-amber/5 border border-amber/10 flex flex-col">
            <div className="flex items-start justify-between">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-amber/10 text-amber">
                <Heart className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <div className="font-display font-black text-4xl tracking-tight text-amber">
                {stats.myReports}
              </div>
              <div className="text-sm font-medium mt-1">Pets I've Found</div>
            </div>
          </div>

          {/* My Handovers */}
          <div className="p-6 rounded-[2rem] bg-moss/5 border border-moss/10 flex flex-col">
            <div className="flex items-start justify-between">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-moss/10 text-moss">
                <ArrowRightLeft className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <div className="font-display font-black text-4xl tracking-tight text-moss">
                {stats.myHandovers}
              </div>
              <div className="text-sm font-medium mt-1">
                Successful Handovers
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============ QUICK LINKS ============ */}
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Link
            to="/my-found-reports"
            className="group flex items-center justify-between p-6 rounded-[2rem] bg-bone border border-ink/10 hover:border-moss/40 hover:bg-moss/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-moss/10 text-moss group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-display font-black text-xl tracking-tight">
                  My Found Reports
                </h3>
                <p className="text-sm text-stone mt-1">
                  Manage pets you've found and request handovers.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-stone group-hover:text-moss group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/handovers"
            className="group flex items-center justify-between p-6 rounded-[2rem] bg-bone border border-ink/10 hover:border-amber/40 hover:bg-amber/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-amber/10 text-amber group-hover:scale-105 transition-transform">
                <ArrowRightLeft className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-display font-black text-xl tracking-tight">
                  My Handovers
                </h3>
                <p className="text-sm text-stone mt-1">
                  Track the status of pets dropped off at the SPCA.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-stone group-hover:text-amber group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>

        {/* ============ RECENT MISSING PREVIEW ============ */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-12"
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display font-black text-2xl tracking-tight">
                Recently Missing
              </h2>
              <p className="text-sm text-stone mt-1">
                Keep an eye out for these friends in your area.
              </p>
            </div>
            <Link
              to="/browse"
              className="inline-flex items-center gap-1 text-sm font-medium text-burnt hover:text-burnt-deep transition-colors"
            >
              View full feed
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentMissing.length === 0 ? (
              <div className="col-span-full py-10 text-center rounded-[2rem] border border-dashed border-ink/15 bg-bone/60">
                <p className="text-stone text-sm">
                  No missing pets reported nearby right now.
                </p>
              </div>
            ) : (
              recentMissing.map((pet, i) => (
                <motion.div
                  key={pet.mpi_id}
                  variants={fadeUp}
                  custom={4 + i * 0.05}
                  initial="hidden"
                  animate="show"
                  className="group rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <Link to="/browse">
                    <div className="aspect-[4/3] bg-ink/5 relative overflow-hidden">
                      {pet.pet_image ? (
                        <img
                          src={pet.pet_image}
                          alt={pet.pet_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-stone">
                          <ImageOff className="w-8 h-8" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-burnt text-bone">
                        <Search className="w-3 h-3" />
                        Missing
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="font-display font-black text-lg tracking-tight truncate">
                        {pet.pet_name}
                      </div>
                      <div className="text-sm text-stone mt-0.5">
                        {pet.species_name} · {pet.colour_name}
                      </div>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-stone">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{pet.predicted_street}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
