import PageTitle from "@/components/PageTitle";

export default function About() {
    return (
        <div className="w-11/12 mx-auto pb-4">
            <PageTitle title="About Us" />
            <div className="flex flex-col items-center md:w-8/12 mx-auto text-lg">
                <h2 className="text-3xl font-bold my-4 pb-4 text-center">Welcome to Bookworm</h2>
                <p className="py-4">
                    "Bookworm is an independent New York bookstore and language school with locations
                    in Manhattan and Brooklyn.
                    We specialize in travel books and language classes."
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold my-4 text-center md:text-left">Our story</h2>
                        <p className="py-4">
                            The name Bookworm was taken from the original name for New York
                            International Airport, which was renamed JFK in December 1963.
                        </p>
                        <p className="py-4">
                            Our Manhattan store has just moved to the West Village. Our new location is 170
                            7th Avenue South, at the corner of Perry Street.
                        </p>
                        <p className="py-4">
                            From March 2008 through May 2016, the store was located in Flatiron District.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold my-4 text-center md:text-left">Our Vision</h2>
                        <p className="py-4">
                            One of the last travel bookstores in the country,
                            our Manhattan store carries a range of guidebooks (all 10% off)
                            to suit the needs and tastes of every traveler and budget.
                        </p>
                        <p className="py-4">
                            We believe that a novel or travelogue can be just as
                            valuable a key to a place as any guidebook, and our well-read,
                            well-traveled staff is happy to make reading recommendations
                            for any traveler, book lover, or gift giver.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}