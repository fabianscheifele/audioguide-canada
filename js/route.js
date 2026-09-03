/* Hinton, AB -> Clearwater, BC  |  Highway 16 (Yellowhead) + Highway 5 (Southern Yellowhead)
 *
 * Coordinates are hand-placed on the highway corridor and are approximate
 * (typically good to a kilometre or so). Trigger radii are deliberately
 * generous, and app.js also fires a stop on "closest approach" so a slightly
 * misplaced point still plays as you drive past it.
 *
 * km = approximate driving distance from Hinton. Used for ordering and for the
 * "next stop in X km" readout, not for triggering.
 */

const ROUTE = {
  id: 'hinton-clearwater',
  title: 'Hinton to Clearwater',
  subtitle: 'Yellowhead Highway 16 & Highway 5 · about 440 km',
  stops: [

  {
    id: 'depart-hinton', km: 0, lat: 53.4114, lon: -117.5638, radius: 3000, intro: true,
    name: 'Leaving Hinton',
    subtitle: 'The foothills, and the road ahead',
    text:
`Welcome aboard, and welcome to the Yellowhead.

You're starting in Hinton, Alberta, about a thousand metres above sea level, in the Athabasca River valley where the rolling foothills run out and the Rocky Mountains begin. Hinton exists because of two things that shaped almost every town you'll pass today: a railway and a resource. The Grand Trunk Pacific pushed a line through here around 1911, and the town took the name of William Hinton, a railway official. Coal came first, then pulp and timber. The mill on the edge of town has been running since the late nineteen fifties.

The road you're on, Highway 16, is the Yellowhead. It's named for Pierre Bostonais, an Iroquois-Métis fur trader and guide of the eighteen twenties whose light-coloured hair earned him the nickname Tête Jaune — Yellow Head. He led Hudson's Bay Company parties over the mountains by a pass that now carries his name, and you'll drive over it in about two hours.

Ahead of you today: roughly four hundred and forty kilometres, two mountain ranges, the Continental Divide, the headwaters of the Fraser, and a time zone change. Settle in.`
  },

  {
    id: 'athabasca-valley', km: 12, lat: 53.3830, lon: -117.6980, radius: 2500,
    name: 'The Athabasca Valley',
    subtitle: 'Where this water is going',
    text:
`The river off to your right is the Athabasca, and it's worth knowing where it's headed, because it's the opposite of where you are.

You're driving southwest, uphill, toward the Continental Divide. The Athabasca is running northeast, downhill, and it does not stop. It flows to Fort McMurray, into Lake Athabasca, then north as the Slave River into Great Slave Lake, then out as the Mackenzie — Canada's longest river — and finally into the Arctic Ocean at the edge of the Beaufort Sea. A raindrop that lands on your windshield right now and rolls into this valley has a clear run of more than four thousand kilometres to the Arctic.

In a couple of hours you'll cross a low, unremarkable-looking saddle in the trees where that stops being true, and everything starts running to the Pacific instead.

The Athabasca is a Canadian Heritage River, recognised for exactly this: it was one of the great highways of the fur trade, the approach route to Athabasca Pass, which was the main way across these mountains for about forty years starting in 1811.`
  },

  {
    id: 'brule-jasper-house', km: 22, lat: 53.3620, lon: -117.8150, radius: 3000,
    name: 'Brûlé Lake & Jasper House',
    subtitle: 'A fur trade post and a ghost town',
    text:
`Off to the north, where the valley widens, is Brûlé Lake — not really a lake at all but a broad, shallow spreading of the Athabasca. It's flanked by sand dunes, which is not what most people expect to find in the Rocky Mountains. The dunes are glacial silt, dropped by meltwater and then picked up and piled by the wind, which funnels down this valley hard and often.

Somewhere along this stretch stood Jasper House, a North West Company and later Hudson's Bay Company trading post established around 1813. It was named for Jasper Hawes, the clerk who ran it. That name eventually spread to the mountain the post sat below, then to the valley, then to the town, then to the national park you're about to enter. A man who kept a ledger in a log building for a few years ended up naming eleven thousand square kilometres of the Rockies.

There was also a coal town here called Brûlé, which boomed in the nineteen twenties and then didn't. Almost nothing is left of either.`
  },

  {
    id: 'front-ranges', km: 34, lat: 53.2900, lon: -117.8800, radius: 3000,
    name: 'Hitting the Front Ranges',
    subtitle: 'Why the mountains start so suddenly',
    text:
`Notice how abruptly the mountains arrive. There's no gradual build — the foothills roll along and then a wall of grey rock stands up in front of you. That edge has a name: the McConnell Thrust, part of the boundary where the Front Ranges begin.

Here's what happened. Between about a hundred and fifty and fifty-five million years ago, tectonic collision along the west coast shoved the western half of the continent eastward. Layers of ancient seafloor limestone, laid down flat over hundreds of millions of years, were sheared into enormous slabs and stacked on top of each other like a shuffled deck — each slab riding up and over the one to its east. That's why the Front Ranges look the way they do: long parallel ridges, all tilted the same way, with steep cliffs facing you and gentler slopes on the far side.

The rock in those cliffs is mostly limestone, which means it's made of the shells and skeletons of marine creatures. Every peak between here and the Divide was once the floor of a tropical sea.`
  },

  {
    id: 'east-gate', km: 44, lat: 53.2430, lon: -117.8950, radius: 2500,
    name: 'Jasper National Park — East Gate',
    subtitle: 'Practical note: you need a pass',
    text:
`You're entering Jasper National Park.

A practical note first: you need a Parks Canada pass to stop anywhere in the park, and you can buy one at the gate. If you're driving straight through without stopping, you generally don't need one — but every viewpoint, washroom, and trailhead between here and the British Columbia boundary is inside the park, so a day pass is usually worth it. Have a card ready and it takes a minute.

Jasper was established in 1907 as Jasper Forest Park, in the same wave of protection that created Banff. At roughly eleven thousand square kilometres it's the largest national park in the Canadian Rockies — bigger than Banff, Yoho and Kootenay put together. Since 1984 it's been part of the Canadian Rocky Mountain Parks UNESCO World Heritage Site.

From here to the Divide you're in a valley that has been a wildlife corridor for ten thousand years and a transport corridor for two hundred. Elk, bighorn sheep, and the occasional bear use the same flat ground the highway does. Watch the shoulders.`
  },

  {
    id: 'pocahontas', km: 51, lat: 53.2160, lon: -117.9550, radius: 2500,
    name: 'Pocahontas & Miette Hot Springs',
    subtitle: 'A coal town inside a national park',
    text:
`On your left is the turnoff for Miette Hot Springs, and the site of a town called Pocahontas.

Yes — a coal mine, operating inside a national park. Pocahontas ran from about 1910 to 1921, named after the coal town in Virginia, and at its peak it had several hundred residents, a school, and a tennis court. Coal from here fed the railway. When the seam played out the town was dismantled, and the park quietly went back to being a park. You can still walk among foundations if you go looking.

The hot springs are seventeen kilometres up that side road, and they're the hottest in the Canadian Rockies — the water comes out of the mountain at around fifty-four degrees Celsius and has to be cooled to about forty before anyone can get in it. The water is rainwater and snowmelt that soaked down through fractured rock, got heated at depth, and rose back up along a fault. The round trip and a soak is about two hours, so it's a detour, not a stop — but it's a good one if you have the time.`
  },

  {
    id: 'disaster-point', km: 58, lat: 53.1950, lon: -118.0100, radius: 2500,
    name: 'Disaster Point',
    subtitle: 'Bighorn sheep on the road — slow down',
    text:
`Slow down through here and keep your eyes on the pavement edge.

This is Disaster Point, and the rocky bluff on your left has a natural mineral lick — an exposure of salts that bighorn sheep crave, especially the ewes in spring and early summer. They come down off the cliffs and stand right at the roadside, or on it, licking the rock and the gravel. Bighorn sheep are magnificent and completely unbothered by traffic, which is a bad combination at a hundred kilometres an hour.

If you see one, expect more. They move in groups, and a lamb will follow its mother across the highway without a glance.

The name, incidentally, comes from a nineteenth-century mishap — accounts differ, but it involved a pack animal, a narrow ledge, and a loss. The point where the rock pinches the valley has always been the hard part of getting through here, for horses, for the railway, and for the road.`
  },

  {
    id: 'jasper-lake', km: 63, lat: 53.1600, lon: -118.0550, radius: 3500,
    name: 'Jasper Lake & the Dunes',
    subtitle: 'A lake that sometimes isn’t',
    text:
`The broad flat sheet of water on your right is Jasper Lake, and depending on when you're passing it may not be much of a lake at all.

Jasper Lake is really just the Athabasca spread thin across a wide gravel floor — in places it's only a metre or two deep. In spring, fed by snowmelt, it fills out and looks like a proper lake. By late summer and autumn it can drop to braided channels wandering across acres of bare sand. Those sand flats are the reason for the dunes along the shore: the wind gets a straight run down this valley, picks up the dried glacial silt, and piles it against the trees.

The mountain rising above the far shore with the blunt, ship's-prow profile is Roche Miette, and it's the landmark of this valley — two thousand three hundred and sixteen metres, standing more or less alone, with a sheer face on its eastern end. For fur traders coming up the Athabasca it was the sign that the mountains had properly begun.`
  },

  {
    id: 'talbot-lake', km: 68, lat: 53.1300, lon: -118.0900, radius: 2500,
    name: 'Talbot Lake',
    subtitle: 'Elk country',
    text:
`Talbot Lake, on your right, is deeper and bluer than Jasper Lake and holds northern pike — big ones, by mountain standards.

The open grasslands along this stretch of valley are some of the best elk habitat in the park, and this is one of the most reliable places in Jasper to see them. Look for tan bodies and pale rumps in the meadows, often in groups of a dozen or more. In late September the bulls are in rut and you may hear bugling — a strange, rising whistle that sounds far too thin to be coming from an animal that size.

The reason for the meadows is that this is a dry valley. The mountains to the west wring most of the moisture out of the weather systems coming off the Pacific, so this eastern side of the park gets noticeably less precipitation. That gives you open grassland and Douglas fir instead of dense wet forest — and that, in turn, gives you elk, sheep, and the predators that follow them.`
  },

  {
    id: 'snaring', km: 74, lat: 53.0400, lon: -118.1350, radius: 3000,
    name: 'The Braided Athabasca',
    subtitle: 'How a glacial river behaves',
    text:
`Look at the river through here — it isn't one channel, it's a dozen, weaving in and out of each other across a wide bed of pale gravel. That's called a braided river, and it's a signature of glacial meltwater.

Glaciers grind rock into everything from boulders to flour. Meltwater picks that load up and carries it, but a river can only carry so much: as the valley flattens and the current slows, the river drops its gravel, builds up its own bed, and then has to find a way around the pile it just made. So it splits, rejoins, splits again, and rearranges itself substantially every spring. The pale, milky colour of the water in summer is rock flour — particles so fine they stay suspended and scatter light.

That same rock flour is why the lakes ahead of you in these mountains are that improbable turquoise. It isn't a mineral or a dye. It's suspended stone dust, catching the blue-green end of the spectrum and throwing it back at you.`
  },

  {
    id: 'jasper-town', km: 80, lat: 52.8737, lon: -118.0814, radius: 3500,
    name: 'Jasper Townsite',
    subtitle: 'Fire, and rebuilding',
    text:
`This is Jasper — about a thousand and sixty metres up, home to somewhere around four to five thousand people, and the last full-service town until Valemount.

It's a railway town at heart, a divisional point where crews changed, and it still has that shape: the tracks and the station right through the middle, the main street running alongside. If you need fuel, food, or a washroom, this is the easy place to do it. South of town the Icefields Parkway heads off toward Lake Louise, and it is one of the great mountain drives on earth — but it is not today's road.

You'll notice burnt forest, and in places burnt town. In July 2024 a wildfire driven by extreme heat and wind ran into Jasper and destroyed roughly a third of the structures in the townsite. It was the most destructive event in the park's history and people here lost homes and businesses. The town is open, working, and rebuilding, and the single most useful thing a visitor can do is stop, spend money, and be patient with a community that is still putting itself back together.`
  },

  {
    id: 'whistlers', km: 87, lat: 52.8550, lon: -118.1300, radius: 2500,
    name: 'Whistlers Mountain',
    subtitle: 'And the animal it’s named after',
    text:
`The mountain south of town with the cable strung up it is Whistlers, and the Jasper SkyTram runs to just over twenty-two hundred metres near its summit — the highest and longest guided aerial tramway in Canada. From the upper station you can walk to the true summit in about an hour, and on a clear day you can see Mount Robson, more than seventy kilometres away.

The name has nothing to do with wind. It's the hoary marmot — a fat, grizzled, cat-sized rodent that lives in the boulder fields above treeline and communicates with a piercing single-note whistle that carries for hundreds of metres. Hikers hear them constantly and rarely see them.

That upper station sits above treeline, which up here is around twenty-one hundred metres. Above that line the growing season is simply too short and the wind too hard for a tree to make a season's worth of wood. What survives is alpine tundra: cushion plants, lichens, and flowers that compress an entire year of growing, blooming and seeding into about six weeks.`
  },

  {
    id: 'cavell', km: 95, lat: 52.8300, lon: -118.2200, radius: 3500,
    name: 'Mount Edith Cavell',
    subtitle: 'A nurse, and a glacier called the Angel',
    text:
`To the south, if the weather is cooperating, you may catch the sharp white face of Mount Edith Cavell — thirty-three hundred metres, and the most conspicuous peak around Jasper.

It's named for Edith Cavell, a British nurse working in occupied Belgium during the First World War. She treated wounded soldiers of both sides and helped roughly two hundred Allied soldiers escape to neutral territory. She was arrested, court-martialled, and executed by firing squad in October 1915. The night before she died she said the line she's remembered for: "Patriotism is not enough. I must have no hatred or bitterness for anyone." Canada named this mountain for her in 1916.

Hanging on its north face is Angel Glacier, so called because it spreads wings of ice out from a central body. Like nearly every glacier in these mountains it has retreated dramatically — in 2012 a large section collapsed into the lake below and sent a wave of ice and water down the valley. The road up there closes often, and the mountain is a serious place.`
  },

  {
    id: 'yellowhead-pass', km: 105, lat: 52.8817, lon: -118.4586, radius: 3000,
    name: 'Yellowhead Pass — the Continental Divide',
    subtitle: 'Two provinces, two oceans, one hour',
    text:
`You are crossing the Continental Divide.

This is Yellowhead Pass, eleven hundred and thirty-one metres — and if it feels underwhelming, that's exactly the point. It's the lowest pass across the Divide in the Canadian Rockies, a broad forested saddle rather than a knife edge. That gentleness is why it mattered: it was the fur traders' route, it was very nearly chosen for the Canadian Pacific Railway's main line, and it eventually carried two other transcontinental railways and this highway.

Three things change at once right here. First, the water. Behind you, everything drains to the Arctic. Ahead, everything drains through the Fraser to the Pacific at Vancouver. Second, the province — you're leaving Alberta and entering British Columbia, and Jasper National Park becomes Mount Robson Provincial Park. Third, the clock: you're crossing from Mountain Time into Pacific Time, so set your watch back an hour. Your phone will usually do it on its own, once it can find a signal to ask.

You've just gained an hour. Enjoy it.`
  },

  {
    id: 'yellowhead-lake', km: 113, lat: 52.8850, lon: -118.5600, radius: 3000,
    name: 'Yellowhead Lake',
    subtitle: 'The Fraser begins',
    text:
`Yellowhead Lake on your left, with Mount Fitzwilliam standing above it — a big blocky quartzite peak, noticeably different in colour and texture from the grey limestone you've been driving past.

You're now in Mount Robson Provincial Park, established in 1913, which makes it one of the oldest protected areas in British Columbia — only Strathcona on Vancouver Island is older. It was created a few years after Jasper, and together the two parks form one continuous block of protected mountain landscape straddling the Divide.

The water leaving this lake is starting a journey worth appreciating. It joins the Fraser River, which rises in these mountains and runs thirteen hundred and seventy-five kilometres — north and west up the Rocky Mountain Trench, then a hard left turn south at Prince George, down through the Cariboo, through the canyon at Hells Gate, and out across the delta at Vancouver into the Strait of Georgia. It's the longest river entirely within British Columbia, and the most productive salmon river in the country. You'll be following its infant version for the next hour.`
  },

  {
    id: 'moose-lake', km: 126, lat: 52.9550, lon: -118.7950, radius: 4000,
    name: 'Moose Lake',
    subtitle: 'Avalanche country',
    text:
`Moose Lake — ten kilometres long, and the highway and the railway share the narrow bench along its shore. This is one of those places where the valley simply doesn't have room for everyone.

Look up at the slopes across the water and you'll see them: long vertical stripes of low green scrub running from high on the mountain right down to the lake, cutting through the dark mature forest. Those are avalanche paths. Every winter, snow slides down those chutes with enough force to snap mature trees, so nothing tall ever gets established. What grows instead is alder, willow and slide shrubs — flexible things that bend flat under the snow and spring back in June.

Those paths are also the best wildlife habitat around. The shrubs are food, the openings green up weeks before the shaded forest does, and grizzly bears come to them in spring specifically for that early growth. So a slope that looks scarred and damaged is actually the richest ground in the valley — a good reminder that in mountains, disturbance and abundance are the same thing.`
  },

  {
    id: 'mount-robson', km: 148, lat: 53.0397, lon: -119.2263, radius: 4000,
    name: 'Mount Robson',
    subtitle: 'The highest peak in the Canadian Rockies',
    text:
`Ahead and to your right is Mount Robson — three thousand nine hundred and fifty-four metres, the highest mountain in the Canadian Rockies, and one of the most spectacular roadside mountain views anywhere in the world.

What makes Robson extraordinary isn't only the summit elevation, it's the relief. The mountain rises about three thousand metres from the valley floor in a single sweep, more or less straight up from the highway. Very few mountains on earth present that much vertical face to a person standing at their base with a coffee.

The Secwépemc name for it is Yuh-hai-has-kun, usually translated as the Mountain of the Spiral Road, for the banded layers of rock that wind around it like a ramp. Those bands are sedimentary strata — old seafloor, tilted and lifted.

And now the catch: Robson makes its own weather. The peak is high enough and stands alone enough that it snags moisture off every passing system and wraps itself in cloud. The summit is completely clear only a minority of days in the year. If you can see it right now, you're in a lucky minority — look properly, because it may be gone in twenty minutes.`
  },

  {
    id: 'rearguard-falls', km: 163, lat: 53.0340, lon: -119.4200, radius: 2500,
    name: 'Rearguard Falls',
    subtitle: 'The end of a twelve-hundred-kilometre swim',
    text:
`On your left is Rearguard Falls, and it's the finish line of one of the most remarkable journeys in the animal world.

Chinook salmon hatch in these headwaters, go down the Fraser to the Pacific as smolts, spend several years in the open ocean growing to twenty kilograms or more, and then come back. They find the mouth of the Fraser, turn upstream, and swim more than twelve hundred kilometres inland, climbing over seven hundred metres, without eating a single thing the entire way. They live on their own body, and they arrive here spent, battered, and dark.

Rearguard Falls is where nearly all of them stop. A handful of exceptional fish get over it. For the rest, this cascade is the wall at the end of the world, and they spawn below it and die.

It's one of the longest salmon migrations on the planet. Late July through August is the window, and there's a short trail from the parking area down to a viewing platform. If it's the season, it's a five-minute walk for something you'll remember longer than most of the mountains.`
  },

  {
    id: 'tete-jaune', km: 170, lat: 52.9650, lon: -119.4370, radius: 3000,
    name: 'Tête Jaune Cache — turn south',
    subtitle: 'The junction, and a vanished boomtown',
    text:
`Here's your junction. Highway 16 carries on west toward Prince George and eventually Prince Rupert. You want Highway 5 south — the Southern Yellowhead — signed for Valemount and Kamloops. From here it's about two hundred and fifty kilometres to Clearwater.

This is Tête Jaune Cache, named for the same Yellow Head, Pierre Bostonais, who cached his furs somewhere near here in the eighteen twenties.

It's hard to believe now, but a century ago this was one of the busiest places in British Columbia. Between about 1911 and 1913, two competing transcontinental railways were being built through this valley at the same time, and Tête Jaune Cache was the forward construction camp for both. It had thousands of people, hotels, saloons, gambling houses, and a reputation bad enough that the provincial police took a particular interest. Steamboats ran down the Fraser from here. Then the rails were finished, the camp moved on, and within a few years it was essentially gone. What's left is a scattering of houses and a highway sign.`
  },

  {
    id: 'robson-valley', km: 180, lat: 52.9000, lon: -119.3500, radius: 3500,
    name: 'The Robson Valley',
    subtitle: 'Three mountain ranges at once',
    text:
`You're now driving south down the Rocky Mountain Trench, and you're between ranges — which is why the valley suddenly feels so wide.

The Trench is one of the largest valleys on earth: a nearly straight furrow more than fourteen hundred kilometres long, running from Montana up to the Yukon, visible from space. It's a fault-controlled valley — the crust is broken along its length — and it forms the western boundary of the Rocky Mountains.

So look left and look right, because they're different mountains. To your east, the Rockies: sedimentary, layered, grey, built of ancient seafloor. To your west, the Cariboo Mountains, the northern end of the Columbia Mountains — older, harder, more metamorphic rock, a completely separate range with a separate history. And further south you'll have the Monashees on your right.

The flat bottom of the valley here is farmland, which you have not seen much of today. It's good ground — glacial silt and river deposits — and there's a small, stubborn agricultural community strung along it between the mountains.`
  },

  {
    id: 'valemount', km: 188, lat: 52.8306, lon: -119.2653, radius: 3500,
    name: 'Valemount',
    subtitle: 'Fuel here — and read this bit',
    text:
`Valemount: about a thousand people, sitting where the Rockies, the Monashees and the Cariboos all meet. The name is a compression of "valley in the mountains."

Now the practical part, and it matters. Valemount is your last easy fuel and full services for a while. It's roughly a hundred and five kilometres from here to Blue River, which is a very small village, and then about another hundred and twenty to Clearwater. Cell coverage between here and Clearwater is patchy to nonexistent for long stretches. If you're below half a tank, fill up here. If anyone needs a washroom or a coffee, this is the sensible place.

One thing worth knowing about Valemount: the Chinook salmon that stopped at Rearguard Falls have relatives that come here instead, up the Fraser and into Swift Creek right at the edge of town. It's about thirteen hundred kilometres from the ocean, and it is generally reckoned to be the longest salmon migration in the world. In August the village runs a viewing area. Not today's season, probably — but that fish comes here every year, and it's a genuinely astonishing thing.`
  },

  {
    id: 'terry-fox', km: 194, lat: 52.7900, lon: -119.2700, radius: 3500,
    name: 'Mount Terry Fox',
    subtitle: 'The Marathon of Hope',
    text:
`The peak in the Rockies to the east of Valemount, around twenty-six hundred and fifty metres, is Mount Terry Fox.

In 1980 Terry Fox, twenty-one years old and three years after losing his right leg to bone cancer, set out from St. John's, Newfoundland to run across Canada on an artificial leg to raise money for cancer research. He ran a marathon a day. Not most days — every day. Forty-two kilometres, on a prosthetic that bruised and bled his stump, in all weather, for a hundred and forty-three consecutive days.

He made it five thousand three hundred and seventy-three kilometres, to just outside Thunder Bay, Ontario, before the cancer reappeared in his lungs and he had to stop. He died the following June, a month short of twenty-three. He never reached British Columbia, which was his home province. The mountain was named for him in 1981, and the provincial park around it protects the approach.

The annual Terry Fox Run now happens in dozens of countries and has raised more than eight hundred million dollars. He is, by a wide margin, the most admired person this country has produced.`
  },

  {
    id: 'canoe-reach', km: 205, lat: 52.7100, lon: -119.2400, radius: 4000,
    name: 'Canoe Reach & the Columbia',
    subtitle: 'A drowned valley',
    text:
`Off to the south and east, filling the Trench, is the long arm of water called Canoe Reach — the northern tip of Kinbasket Lake. It looks like a natural lake. It isn't.

This is a reservoir, created when Mica Dam was completed in 1973 about two hundred kilometres downstream. Mica is one of the largest earthfill dams in the world, and behind it the water backed up and drowned the entire floor of the Canoe River valley — forests, farms, a railway line, and the small communities that were there. Kinbasket Lake is now over two hundred kilometres long.

Mica was built under the Columbia River Treaty, signed between Canada and the United States in 1961 and ratified in 1964. Canada agreed to build storage dams to control flooding and generate power downstream in the American Pacific Northwest, in exchange for cash and a share of the electricity. It's been argued about ever since. Roughly two thousand people in the Columbia basin were displaced, and when the reservoir is drawn down in spring you can still see stumps and old road grades emerging from the mud — the outline of a valley that used to be somewhere.`
  },

  {
    id: 'albreda', km: 218, lat: 52.6300, lon: -119.1800, radius: 3500,
    name: 'Albreda — a second divide',
    subtitle: 'The North Thompson starts here',
    text:
`You've just crossed another height of land — a quiet one, with no sign and no ceremony, but a real one.

Behind you, the water was running north into the Fraser, or east into the Canoe and the Columbia. Ahead of you, everything drains into the North Thompson River, which you'll now follow all the way to Clearwater. The North Thompson joins the South Thompson at Kamloops, becomes the Thompson, and pours into the Fraser at Lytton after passing through some genuinely violent canyon. So this water also ends up in the Pacific at Vancouver — just by a much longer and rougher road.

The little stream appearing beside you is the North Thompson in its infancy. Over the next two hundred kilometres you'll watch it grow from something you could step across into a substantial river.

The name Thompson honours David Thompson, the surveyor and mapmaker who charted much of western Canada for the North West Company. Characteristically, he never actually saw this river. It was named for him by Simon Fraser, who did.`
  },

  {
    id: 'inland-rainforest', km: 245, lat: 52.4000, lon: -119.2000, radius: 5000,
    name: 'The Inland Rainforest',
    subtitle: 'A rainforest six hundred kilometres from the sea',
    text:
`Look at the forest now. It's changed. It's darker, wetter, denser, with big western redcedar and hemlock and moss hanging off everything — and that is genuinely strange this far inland.

This is the interior wet belt, and it contains the only inland temperate rainforest of its kind on Earth. The mechanism is the Columbia Mountains to your west: storms come off the Pacific, dump on the coast, cross the dry interior plateau, and then hit these ranges and get forced up and wrung out a second time. The result is coastal-scale precipitation, six hundred kilometres from the ocean, with big snowpacks that keep the ground damp all summer.

Some of the cedars in these valleys are over a thousand years old and three or four metres through the trunk. The ecosystem depends on that continuity — certain lichens that grow only in old canopies are the winter food of the mountain caribou that live here, an endangered deep-snow population that has declined severely. Old growth here isn't scenery. For those animals it's the entire food supply, and where it's been logged, they've gone.`
  },

  {
    id: 'cheadle-milton', km: 262, lat: 52.2800, lon: -119.2400, radius: 4500,
    name: 'Milton & Cheadle',
    subtitle: 'Two Victorians and a very bad idea',
    text:
`Some of the peaks along here carry the names Milton and Cheadle, and there's a story attached.

In 1862 Viscount Milton, a sickly young English aristocrat, and Doctor Walter Cheadle, his physician and travelling companion, set out to cross British North America overland to the Pacific — partly for sport, partly to see whether a route existed. They were amateurs. They wintered on the prairies, crossed the Rockies by Yellowhead Pass in 1863, and then attempted to descend the North Thompson, which no one sensible would do.

The valley you're driving through comfortably at a hundred kilometres an hour nearly killed them. They ran out of food, ate their pack horses, hacked through deadfall and swamp for weeks, and emerged at Kamloops in a condition that shocked everyone who saw them. Their book about it, "The North-West Passage by Land," became a bestseller in Britain and did a great deal to convince the British public that a transcontinental route through Canada was possible — which, indirectly, helped make the case for Confederation and the railway.

They were very lucky men, and not especially good explorers.`
  },

  {
    id: 'blue-river', km: 293, lat: 52.1167, lon: -119.2833, radius: 3500,
    name: 'Blue River',
    subtitle: 'Last services before Clearwater',
    text:
`Blue River — a few hundred people, and the only real services between Valemount and Clearwater. Fuel, a couple of places to eat, washrooms. If you skipped Valemount, do not skip this. It's about a hundred and twenty kilometres to Clearwater from here, and there is very little in between.

Blue River is a railway town that found an unusual second act. In 1970 an Austrian ski racer named Mike Wiegele set up a helicopter skiing operation here, and it grew into one of the largest in the world. The reason is right outside the window: the Monashee Mountains on one side, the Cariboos on the other, both of them catching that inland-rainforest snowfall, giving enormous quantities of light, dry powder over a huge area of glaciated terrain with nobody in it. In winter the population of this village multiplies and the sky is full of helicopters.

In summer it goes quiet again, and it's a fishing and paddling town on Eleanor Lake. The abrupt seasonality is the normal condition of almost every community you've driven through today.`
  },

  {
    id: 'wells-gray-north', km: 310, lat: 52.0000, lon: -119.3000, radius: 4500,
    name: 'The Back of Wells Gray',
    subtitle: 'Five thousand square kilometres of nothing',
    text:
`West of you now, beyond that first ridge, is the northern end of Wells Gray Provincial Park — and there is no road into it from this side. None.

Wells Gray covers about five thousand two hundred and fifty square kilometres. That's larger than several countries, and roughly two-thirds the size of Banff National Park. The only vehicle access is a single road north from Clearwater that penetrates the southern edge and stops. Everything beyond that is reached on foot, by canoe, or by float plane.

Inside there are volcanoes, lava beds, hundred-metre waterfalls, two enormous lakes, glaciers, and one of the densest populations of moose in British Columbia. There are valleys in there that see a handful of people in a year.

It was established in 1939 and named for Arthur Wellesley Gray, then the provincial Minister of Lands. You'll be arriving at its front door in about an hour, and the contrast is worth holding onto: what you'll see from the Clearwater road is spectacular, and it's a fingernail's worth of what's actually in there.`
  },

  {
    id: 'pyramid-falls', km: 320, lat: 51.8600, lon: -119.3200, radius: 3000,
    name: 'Pyramid Creek Falls',
    subtitle: 'Old cedars, ten minutes off the road',
    text:
`There's a pullout along here for Pyramid Creek Falls, and it's one of the best short stops on this entire highway — about a ten-minute walk each way through genuine old-growth western redcedar to a viewing platform beneath a tall, narrow waterfall.

The cedars are the point as much as the falls. Western redcedar is the great tree of this wet interior: rot-resistant, straight-grained, and enormously long-lived. The wood is so durable that fallen trunks lie on the forest floor for centuries, slowly becoming the seedbeds for the next generation — foresters call them nurse logs, and you'll see young trees growing in a straight line along the top of a rotting ancestor.

For the Interior Salish peoples of this valley, redcedar was structural to daily life: canoes, house planks, boxes, rope, baskets, clothing, all from one species. Bark could be stripped from a living tree in a way that let it keep growing, and there are cedars still standing in this region with harvest scars two or three hundred years old — the physical record of people who were here long before this road was.`
  },

  {
    id: 'avola', km: 333, lat: 51.7833, lon: -119.3167, radius: 3000,
    name: 'Avola',
    subtitle: 'A railway siding that stayed',
    text:
`Avola — and if you blink you'll miss it. A few dozen people, a store, and a very long relationship with the railway.

Almost every named place along this valley began as a siding: a stretch of parallel track where a train could pull over and let another pass. Steam locomotives needed water and coal at regular intervals, so sidings went in every twenty kilometres or so, each with a section crew living alongside to maintain the rails. Diesel ended the need for water stops and welded rail ended the need for constant maintenance, and one by one the sidings emptied out. The names survive on maps and highway signs, attached to nothing much.

This section of valley was also heavily logged through the twentieth century, and the forest you're driving through is largely second growth, which is why it looks more uniform than the tangled old stuff around Pyramid Creek.

The North Thompson beside you is now a proper river, and it's about to do something interesting.`
  },

  {
    id: 'little-hells-gate', km: 348, lat: 51.7200, lon: -119.4000, radius: 4000,
    name: 'Little Hells Gate',
    subtitle: 'The river gets serious',
    text:
`Through here the North Thompson pinches into a narrow rock canyon known as Little Hells Gate — named for its bigger and far more famous cousin on the Fraser, where the entire river is squeezed through a gap about thirty-five metres wide.

When a river is forced into a slot like this, the water has nowhere to go but down and faster. Depth and velocity both spike, and the current takes on that heavy, muscular, boiling texture — standing waves, whirlpools, and water moving upstream along the walls.

This canyon was the crux of Milton and Cheadle's terrible descent, and it was also the reason the North Thompson never became a serious transport route. Fur brigades and gold seekers tried the river; the canyons persuaded them not to.

For salmon, canyons like this are the toll gates of the journey. At Hells Gate on the Fraser, railway construction in 1914 dumped so much rock into the canyon that it effectively blocked the migration, and Fraser sockeye runs collapsed for decades. Fishways built in the nineteen forties finally reopened it. It remains one of the largest human-caused fisheries disasters in Canadian history.`
  },

  {
    id: 'simpcw', km: 365, lat: 51.6500, lon: -119.6000, radius: 4500,
    name: 'Simpcw Territory',
    subtitle: 'The people of the North Thompson',
    text:
`You've been driving through Simpcw territory for the last several hours.

The Simpcw are one of the constituent communities of the Secwépemc, or Shuswap, Nation — the largest Interior Salish nation, whose traditional territory covers around a hundred and eighty thousand square kilometres of south-central British Columbia. The Simpcw division held the North Thompson watershed, from around Barriere all the way up to Tête Jaune Cache, which is essentially the entire route you've driven since the junction.

This was never empty country. The valley was a seasonal round: salmon on the river in summer, hunting in the uplands, winter villages of pit houses — semi-subterranean, dug into a river terrace and roofed with poles and earth, warm through a valley winter that regularly goes to minus thirty. The depressions of those houses are still visible in places along the terraces, if you know the shape to look for.

Smallpox in the nineteenth century, the reserve system, and residential schools all landed here. The Simpcw are still here, based at Chu Chua near Barriere, running forestry and fisheries and actively involved in the caribou and salmon recovery work in this valley.`
  },

  {
    id: 'vavenby', km: 385, lat: 51.5833, lon: -119.7667, radius: 3000,
    name: 'Vavenby',
    subtitle: 'A mill town without a mill',
    text:
`Vavenby, on the far side of the river. Small, quiet, and a fair illustration of what has happened to resource towns in this province.

The sawmill here closed in 2019, taking with it most of the community's employment. The reasons are the ones you hear all over the interior: mountain pine beetle killed vast areas of lodgepole pine across British Columbia in the two thousands, mills ran hot for years processing the dead wood while it was still usable, and then the supply ran out. Add decades of harvest that outpaced regrowth, a shrinking allowable cut, and softwood lumber disputes with the United States, and mills that had defined towns for sixty years closed within a few years of each other.

What's left is a village of a few hundred people in a very beautiful valley, working out what comes next. Some of it is ranching, some is tourism from the Wells Gray traffic, some is people commuting a long way.

You're about forty minutes from Clearwater now, and the valley is opening up.`
  },

  {
    id: 'birch-island', km: 400, lat: 51.6000, lon: -119.9000, radius: 3500,
    name: 'Into the Clearwater Valley',
    subtitle: 'The volcanoes under your wheels',
    text:
`As you come down toward Clearwater, keep an eye out for black rock — dark, blocky, sometimes with visible columns, very different from anything you've passed today.

That's lava. You are entering the Wells Gray–Clearwater volcanic field, an area of young volcanism that has been active on and off for roughly the last three million years, with eruptions as recent as a few thousand years ago. It's not a single big cone; it's dozens of small volcanoes, cinder cones and lava flows scattered across the plateau.

Some of those eruptions happened under glaciers during the ice ages, and that produces distinctive landforms — flat-topped, steep-sided mountains called tuyas, where lava melted a chamber up through the ice and then ponded and cooled against walls of it. There are textbook examples in this area.

And crucially, those lava flows filled the valleys with hard rock. When the rivers came back afterwards they had to cut down through it — and that is precisely why the country you're about to arrive in has so many enormous waterfalls.`
  },

  {
    id: 'wells-gray', km: 412, lat: 51.6350, lon: -119.9800, radius: 3000,
    name: 'Wells Gray & Helmcken Falls',
    subtitle: 'Canada’s waterfall park',
    text:
`Coming up on your right is the Clearwater Valley Road, the only vehicle route into Wells Gray Provincial Park — and if you have half a day here, this is what you spend it on.

Wells Gray is sometimes called Canada's Waterfall Park, and the reason is the lava you just heard about: rivers cutting down through stacked volcanic rock produce hard ledges and sudden drops. Spahats Creek Falls is about ten minutes up the road, plunging out of a slot in a canyon wall so that you see the layers of old lava flows stacked in cross-section like a cut cake. Dawson Falls is a wide curtain, ninety metres across.

And then there's Helmcken Falls: a hundred and forty-one metres, four times the height of Niagara, dropping free into an enormous circular amphitheatre of volcanic rock. There's a viewpoint you can drive to. In deep winter the spray freezes into a snow cone at the base that can build over sixty metres high — one of the strangest sights in Canada.

The road in is about forty kilometres of pavement to the main viewpoints. Worth every minute.`
  },

  {
    id: 'clearwater', km: 425, lat: 51.6500, lon: -120.0350, radius: 4000,
    name: 'Arriving in Clearwater',
    subtitle: 'You made it',
    text:
`Welcome to Clearwater.

You're at the confluence of the Clearwater River and the North Thompson, about four hundred metres above sea level — which means you've dropped seven hundred metres since Yellowhead Pass and left the high mountains behind. Notice how much drier and more open it feels here than it did an hour ago. You're on the edge of the interior plateau now, moving toward the sagebrush and ponderosa pine country that runs south to Kamloops.

Clearwater is a town of around twenty-three hundred people that has largely reinvented itself as the gateway to Wells Gray, after the usual century of forestry and railway work.

So: about four hundred and forty kilometres today. You crossed the Continental Divide at the lowest pass in the Canadian Rockies, drove past the highest peak in those mountains, watched water change its mind twice about which ocean it belongs to, followed the birth of two major rivers, passed through the only inland temperate rainforest on Earth, and finished on top of a volcanic field.

That's a good day's driving. Thanks for the company — enjoy Wells Gray.`
  }

  ]
};

if (typeof module !== 'undefined') { module.exports = ROUTE; }
