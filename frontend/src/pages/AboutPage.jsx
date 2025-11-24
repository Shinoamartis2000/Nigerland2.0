import React from 'react';
import { Award, Heart, BookOpen, Users, Building, Lightbulb, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Kelechi Ngwaba",
      title: "Lead Consultant & Promoter of Nigerland Books Foundation",
      credentials: "Fellow of the Institute of Chartered Accountants of Nigeria (FCA), Writer and Management Consultant",
      image: "/assets/team/kelechi.jpg",
      bio: "Published THE GENERATIONS (2007), THREE FEET TALL (2011), NEVER AGAIN (2020), and numerous books for primary school pupils."
    },
    {
      name: "Uduak Nkanga Ngwaba",
      title: "Head of Logistics & Marketing",
      credentials: "Member of Nigerland Books Foundation",
      image: "/assets/team/uduak.jpg",
      bio: "Leading our logistics arm, providing first-class services in travels, tours and comprehensive marketing solutions."
    }
  ];

  const foundationMembers = [
    "Dr. (Mrs) Ada Onyebuenyi",
    "Mrs Uduak Nkanga Ngwaba",
    "Charles Chukwuonye",
    "Urenna Ajuzie",
    "Adaeze Ezenwabekee",
    "Dr Edwin Mboho"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Award className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Nigerland</h1>
            <p className="text-2xl text-blue-100">
              Celebrating 25 Years of Excellence (2000-2025)
            </p>
          </div>
        </div>
      </section>

      {/* Our Company Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <Building className="w-12 h-12 text-blue-600" />
              <h2 className="text-4xl font-bold">OUR COMPANY</h2>
            </div>

            <Card className="border-2 border-blue-200 mb-8">
              <CardContent className="pt-6 space-y-4 text-lg leading-relaxed">
                <p className="font-semibold text-gray-800">
                  The CONSULTANTS who formed NIGERLAND,<br/>
                  RECOGNIZING the importance of Human Capital,<br/>
                  REALIZING the usefulness of training in shaping Man's decisions,<br/>
                  CONSIDERING the overriding impact of Man's decisions on his Environment,<br/>
                  DETERMINED to form a Consulting Consortium,<br/>
                  AIMED at developing MEN, IDEAS & SOLUTIONS.
                </p>
                
                <p className="text-gray-700">
                  Thus in year 2000, under the leadership of Professor Francis Ngwaba (American Fulbright Scholar and Professor of English Literature), Nigerland was established.
                </p>

                <div className="bg-blue-50 p-6 rounded-lg space-y-3">
                  <p className="text-gray-700">
                    Nigerland has partnered with tertiary institutions to train over <strong>8,000 people</strong> who have contributed their quota to the growth of the Nigerian economy. Some of these institutions include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>The Polytechnic Calabar</li>
                    <li>Grace Polytechnic Surulere</li>
                    <li>Abia State University</li>
                  </ul>
                </div>

                <p className="text-gray-700">
                  Nigerland has also trained for Corporate organizations such as Nigerian Airspace Management Agency, Federal Ministry of Mines and Steel Development, Cross River State Government (Office of the Wife of the Governor during the 2009 Calabar Children's Carnival).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Good Governance Campaign */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold mb-6 text-center">Good Governance Campaign (2007)</h3>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-lg text-gray-700">
                  In 2007, Nigerland published <strong>THE GENERATIONS</strong> (a story on good governance) and used the book to launch a good governance campaign in Nigeria. This campaign necessitated that copies of the book were made available to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ul className="space-y-2 text-gray-700">
                    <li>• The Nigerian Television Authority headquarters in Abuja</li>
                    <li>• Dangote group headquarters in Ikoyi Lagos</li>
                    <li>• Daily Independent Newspapers</li>
                    <li>• Intercontinental Bank</li>
                    <li>• May and Baker PLC</li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li>• University of Jos</li>
                    <li>• Gombe State University</li>
                    <li>• College of Education Ankpa</li>
                    <li>• University of Calabar</li>
                    <li>• Federal College of Education Yola</li>
                  </ul>
                </div>
                <p className="text-lg text-gray-700">
                  The campaign saw the Nigerland team distribute free copies of the book to the libraries of over <strong>sixty (60) tertiary institutions in Nigeria</strong>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Primary Education Support Scheme */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold mb-6 text-center text-blue-600">Primary Education Support Scheme (PESS)</h3>
            <Card className="border-2 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-lg text-gray-700 mb-4">
                  As part of its Corporate Social Responsibility, Nigerland, recognizing that some Nigerian school children have never owned a text/story book in their lives, launched a <strong>PRIMARY EDUCATION SUPPORT SCHEME (PESS)</strong> and through this medium donated free story books to students in several local governments in Nigeria:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-blue-50 p-4 rounded-lg">
                  <div className="text-gray-700">• Abi Local Government</div>
                  <div className="text-gray-700">• Obudu Local Government</div>
                  <div className="text-gray-700">• Isiala Ngwa South LG</div>
                  <div className="text-gray-700">• Obubra Local Government</div>
                  <div className="text-gray-700">• Calabar South</div>
                  <div className="text-gray-700">• Calabar Municipal</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-6 text-center">Our Philosophy</h3>
            <Card className="border-2 border-blue-300">
              <CardContent className="pt-6 space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  The underlying philosophy of the creation of NIGERLAND is the <strong>betterment of MAN AND HIS SOCIETY</strong>. Nigerland believes that if Man is properly developed then mankind can go and sleep. Failure in governance is due to Man's failure. Failure in provision of health care facilities and social amenities is due to Man's failure. Man constantly fails himself.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  There is therefore the need to get IT RIGHT WITH MAN and as trainers, Consultants with Nigerland view man as a being that must be appreciated, cajoled, persuaded and loved. That way, even the dumbest of brains will not LEAVE THE TRAINING CENTRE EMPTY.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 italic">
                  <p className="text-lg font-semibold text-gray-800">
                    "COMFORTABLE SEATERS BY THE FIRE SIDE CAN ONLY EAT MAIZE AND NOT OMLETTE."
                  </p>
                  <p className="text-sm text-gray-600 mt-2">- Professor Francis Ngwaba (1937-2004)</p>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Nigerland therefore calls on ENTREPRENEURS, SMEs, BLUE CHIPS, STATE & FEDERAL GOVERNMENTS & THEIR PARASTATALS to rise from their comfort zones and seek new and better ways of doing things.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed font-semibold">
                  We must rise to the challenges of this millennium because the challenges and circumstances of the 21st Century will require 21st Century solutions even though they might take a cue from the wisdom of History.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {teamMembers.map((member, idx) => (
                <Card key={idx} className="border-2 hover:border-blue-600 transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-blue-600 shadow-lg">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-2xl mb-2">{member.name}</CardTitle>
                      <p className="text-lg font-semibold text-blue-600">{member.title}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Credentials</h4>
                      <p className="text-gray-700">{member.credentials}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">About</h4>
                      <p className="text-gray-700">{member.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nigerland Books Foundation */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Heart className="w-12 h-12 text-pink-600" />
              <h2 className="text-4xl font-bold">Nigerland Books Foundation (NBF)</h2>
            </div>

            <Card className="border-2 border-pink-200">
              <CardContent className="pt-6 space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong>NIGERLAND BOOKS FOUNDATION (NBF)</strong> is a knowledge based NGO that seeks to instill Morals, Ethics and Values (MEVs) which are largely the bane of development.
                </p>

                <div>
                  <h3 className="text-2xl font-bold mb-4 text-pink-600">Our Aims:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Eradicating illiteracy</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Promoting reading culture</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Using education to fight hunger and ignorance</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Positive thinking</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Enhancing creative thinking</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Building future leaders</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Enhancing present leadership efficiency</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Enhance societal tolerance and love</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Grow knowledge on health and safety</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Building Capacity</span>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-50 p-6 rounded-lg border-2 border-pink-200">
                  <p className="text-lg text-gray-700 italic leading-relaxed">
                    "A hungry Man, Woman or Child cannot read books; neither can a sick person. A displaced person can only run for survival and a person ravaged by war will cherish arms as his or her best companions."
                  </p>
                  <p className="text-gray-700 mt-4 leading-relaxed">
                    Today, the world, through the efforts of bad leaders, has been turned to a theatre of hunger, sickness, famine, disease, violence and war. Nigerland Books Foundation (NBF) aims at contributing its quota towards mending this anomaly.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    NBF operates on the premise that a well brought up person cannot deviate from his manners when he gets into leadership positions. <strong>Catching them young is therefore a MUST for NBF.</strong>
                  </p>
                  <p className="text-lg font-semibold text-purple-800">
                    Mathematically speaking:<br/>
                    Possession of MEVs = RIGHT ATTITUDE = REFLECTIVE ASSIMILATION = DESIRED OUTPUT
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">Foundation Members:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {foundationMembers.map((member, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-pink-200 text-center">
                        <Users className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">{member}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 mt-4 text-center italic">
                    The foundation also has a host of Consultants that are called upon from time to time to partake in her programmes and projects.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">WELCOME TO NIGERLAND!!!</h2>
            <p className="text-3xl font-bold">THIS IS OUR WORLD!!!!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
