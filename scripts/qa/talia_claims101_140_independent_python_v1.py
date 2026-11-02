#!/usr/bin/env python3
"""Original fictitious arithmetic for Foundation teaching claims 101–140.
No SEC/legal acceptance, book rights, private data or official graded outcomes.
The five remaining topics are qualitative and explicitly require manual review.
"""
import json,math
cases={
101:50*.4,
102:(39-40+1.5)/40,
103:(.30*4)/24,
104:1000-100,
106:1000*10,
107:22-18,
108:1000*.06/2,
109:50/800,
110:1000/(1+.05),
111:1000*1.03,
112:1000/(1+.10),
113:(9800000-200000)/400000,
114:.076-.080,
115:50-20,
116:300000+50000,
117:max(700000-800000,0),
118:15.25-15.20,
120:10*(23-20),
121:(100*.30)/15,
122:(1+.10)*(1-.10)-1,
123:math.sqrt((1+.20)*(1-.10))-1,
124:(1+.08)/(1+.03)-1,
125:(1+.05)**2-1,
126:.6*.10+.4*(-.05),
127:(600*(1+.20))/(600*(1+.20)+400),
128:720-.6*(720+400),
129:sum(w*w for w in (.5,.3,.2)),
130:.5*(-.10)+.5*(-.10),
134:(100-60-30)/100,
135:12/3,
136:120/((20+30)/2),
137:(18/180)*365,
138:15/((80+120)/2),
139:90/60,
140:5/50
}
qualitative={
105:"Preferred terms: noncumulative dividends not carried forward without contractual cumulative status.",
119:"Maturity date is not Macaulay duration; coupon timing requires contract specifics.",
131:"10-Q first fiscal quarters cannot be silently treated as audited annual 10-K income.",
132:"Signed conditional agreement not proof an 8-K event has completed or proceeds received.",
133:"Filing fiscal period and EDGAR acceptance are not proof of exact historical public availability."
}
assert len(cases)==35 and len(qualitative)==5
assert set(cases).isdisjoint(qualitative) and sorted(list(cases)+list(qualitative))==list(range(101,141))
print(json.dumps({"values":{str(k):v for k,v in cases.items()},
 "qualitative":{str(k):v for k,v in qualitative.items()},
 "finalEditorialApproved":False,"marketDataRightsApproved":False,
 "regulatoryRemediation":[104,133],
 "sourceMismatch":[129],
 "status":"independent_fictional_math_only_not_publication"},sort_keys=True))
