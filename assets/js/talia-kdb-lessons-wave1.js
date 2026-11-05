/* Crownlight Talia / Knowledge Database interactive wave 1.
 * 16 independently authored, source-linked subjects. Original fictional cases only.
 * This public file contains no member articles, assessments, answers or protected grades.
 * Article is provided only AFTER the existing membership-controlled read API succeeds.
 */
(function(root){
'use strict';
const N=(kind,prompt,values,unit,why)=>({kind,prompt,values,unit,why});
const C=(prompt,options,correct,why)=>({kind:'choice',prompt,options,correct,why});
const L=[
{slug:'knowledge-b002-bid-ask-spread-and-midpoint',title:'Reading the Bid, Ask, Spread, and Midpoint',
 concept:'At one quoted instant, the bid is displayed buying interest and the ask is displayed selling interest. Spread = ask − bid; midpoint = (bid + ask) ÷ 2.',
 teach:'The displayed spread measures the difference between two quoted prices, not a guaranteed execution cost. Quote sizes, timestamps, and available venues also matter.',
 mistake:'The midpoint is not an offer to execute a trade.',
 limit:'A quote can change or disappear before an order arrives. No historical order book is supplied.',
 source:'https://www.investor.gov/introduction-investing/investing-basics/glossary/ask-price',
 predict:'What else would you need to know before claiming that 200 shares can be purchased at the displayed ask?',
 assess:'Explain why a midpoint calculation cannot establish a guaranteed buy fill.',
 cases:[
 N('spread','A fictional quote shows bid $19.80 and ask $20.10. Calculate the displayed spread in dollars.',{bid:19.8,ask:20.1},'USD','Subtract 19.80 from 20.10. The quoted spread is $0.30; neither quote guarantees an executable fill.'),
 N('midpoint','A new fictional quote shows bid $8.40 and ask $8.60. Calculate the midpoint.',{bid:8.4,ask:8.6},'USD','(8.40 + 8.60) ÷ 2 = $8.50. The midpoint is a reference, not a promise of execution.'),
 N('spread','At another fictional instant, bid $12.25 and ask $12.37. Determine the spread.',{bid:12.25,ask:12.37},'USD','The spread is $0.12. A quote alone cannot establish fills or venue-wide depth.')
 ]},
{slug:'knowledge-b002-market-order-with-depth',title:'Market Orders and Multiple Available Price Levels',
 concept:'A market order seeks prompt execution but does not guarantee a particular execution price. The last sale and the best displayed ask are not promises for an entire buy order.',
 teach:'A displayed two-level offer ladder is hypothetical evidence about liquidity at one instant. Calculate a conditional order cost only when the exercise explicitly assumes both quotes remain available.',
 mistake:'Do not call a conditional displayed-depth calculation an actual market fill.',
 limit:'Routing, other traders, quote cancellations, trade size and slippage can change realized executions.',
 source:'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14',
 predict:'If a 40-share market order meets only 10 displayed shares at the best ask, what may happen to the remainder?',
 assess:'What additional evidence would be required to establish the actual execution cost of a market order?',
 cases:[
 N('ladderCost','CONDITIONAL fictional ladder: 10 shares available at $10.00 and 20 at $10.10. Assuming both offers remain and 30 shares fill in those amounts, compute gross cost.',{q1:10,p1:10,q2:20,p2:10.1},'USD','10×$10.00 + 20×$10.10 = $302.00; this is not an actual or guaranteed execution.'),
 N('ladderCost','CONDITIONAL separate ladder: 15 shares at $6.20 and 25 shares at $6.28. Assume both prices/quantities persist. Cost for 40 shares?',{q1:15,p1:6.2,q2:25,p2:6.28},'USD','15×6.20 + 25×6.28 = $250.00; actual fills would require order execution records.'),
 N('ladderCost','CONDITIONAL transfer: 12 shares at $11.75 and 8 at $11.90. Assume both offers accessible and unchanged. Calculate a 20-share gross cost.',{q1:12,p1:11.75,q2:8,p2:11.9},'USD','12×11.75 + 8×11.90 = $236.20; this must remain a fictional what-if.')
 ]},
{slug:'knowledge-b002-buy-and-sell-limit-orders',title:'Limit Order Price Conditions and Nonexecution',
 concept:'A buy limit is the highest acceptable buy price; a sell limit is the lowest acceptable sell price. The limit is a price condition, not a guarantee of execution.',
 teach:'Whether an order actually fills depends on accessible liquidity, priority, routing and changing quotes. A favorable last trade alone does not prove your order executed.',
 mistake:'A limit order can remain open even if market price touches the limit.',
 limit:'Brokerage order instructions and extended-hours eligibility can differ.',
 source:'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders',
 predict:'If the displayed ask briefly touches a buy limit, what order-book facts remain unknown?',
 assess:'Distinguish an acceptable price from a confirmed filled order.',
 cases:[
 C('Buy limit $10.20; displayed ask $10.25. Which conclusion follows?',['The buy limit has definitely filled.','The displayed ask is above the allowed buy price; no fill can be inferred.','The buyer must pay $10.25.'],1,'A buy limit does not authorize paying above $10.20, and nonexecution remains possible.'),
 C('Sell limit $14.50; last trade $14.60. Which inference is defensible?',['A $14.50 or better fill is certain.','The last sale proves your order received priority.','The last sale alone cannot confirm your sell limit filled.'],2,'A last sale is not the member’s execution confirmation.'),
 C('Buy limit $5.75; displayed ask $5.70 for five shares, desired size 100 shares. Which claim survives?',['A full 100-share execution is not established.','All 100 shares must fill at $5.70.','The order becomes a market order.'],0,'Five displayed shares at one quote do not prove executable depth or priority for 100 shares.')
 ]},
{slug:'knowledge-b002-stop-order-trigger-versus-fill',title:'Stop Order Trigger Is Not a Guaranteed Exit Price',
 concept:'When a conventional stop order is triggered it generally becomes a market order; the stop threshold is not a guaranteed transaction price.',
 teach:'A stop-limit adds a limit-price restriction, but that can leave the order unfilled in a rapid move. Check the broker’s specific trigger rules and supported order types.',
 mistake:'A displayed stop threshold is not a guaranteed maximum realized loss.',
 limit:'Gaps, halts, thin liquidity and routing can produce execution prices away from the intended stop.',
 source:'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15',
 predict:'A stock trades through a planned sell-stop level after a gap. Why can realized loss exceed the amount in the plan?',
 assess:'Compare the execution risk of a triggered stop-market order with the nonexecution risk of a stop-limit.',
 cases:[
 C('A fictional sell stop is $19.00 and the next eligible trade occurs at $18.30. What is defensible?',['The order must fill at exactly $19.00.','The stop can trigger but the eventual market execution price is not guaranteed.','The stop automatically becomes a $19.00 limit order.'],1,'A conventional triggered stop-market is exposed to prevailing market conditions.'),
 C('A sell stop-limit uses stop $15.00, limit $14.80. Only bids at $14.50 remain. What risk is illustrated?',['The order may remain unfilled because the limit excludes $14.50.','The broker must fill at $15.00.','The order guarantees exiting before a loss.'],0,'A stop-limit prioritizes its limit price even if that prevents execution.'),
 C('A new fictional sell-stop threshold is $10, then a fast market trades at $9.40. Choose the correct inference.',['A $10 exit is guaranteed.','All positions close at the last price before the trigger.','A triggered market order may execute below $10.'],2,'Execution after the trigger is a separate event and can occur at a worse price.')
 ]},
{slug:'knowledge-b002-simple-percent-return',title:'Simple Percentage Change and Return Denominators',
 concept:'Price percentage change is (ending − starting) ÷ starting × 100. The starting reference—not the final value—is the denominator.',
 teach:'State the reference price, interval, units and whether cash distributions or fees are omitted. Simple price change is not automatically total investment return.',
 mistake:'Dividing by the final price creates a different statistic.',
 limit:'This case ignores dividends, fees, corporate actions, taxes and any intraperiod path.',
 source:'https://www.investor.gov/introduction-investing',
 predict:'Why can a +20% price increase fail to reverse a prior −20% decrease?',
 assess:'Which price is the correct denominator when measuring a change from an earlier starting point?',
 cases:[
 N('percent','FICTIONAL: price begins at $40 and finishes at $46. Calculate simple percentage price change.',{start:40,end:46},'percent','(46−40)÷40×100 = +15%.'),
 N('percent','FICTIONAL: price declines from $50 to $42. Calculate the signed percentage change.',{start:50,end:42},'percent','(42−50)÷50×100 = −16%. The denominator is the beginning price.'),
 N('percent','FICTIONAL transfer: price moves from $12.50 to $13.75. Find the signed percentage change.',{start:12.5,end:13.75},'percent','(13.75−12.50)÷12.50×100 = +10%.')
 ]},
{slug:'knowledge-b002-loss-recovery-asymmetry',title:'Why Recovering a Loss Requires a Larger Gain',
 concept:'After a loss of L percent, the necessary gain on the reduced value to restore the original value is L ÷ (100−L) × 100 percent.',
 teach:'The base shrinks after a loss. The percentage return needed to get back to the original amount is therefore larger than the percentage previously lost.',
 mistake:'A 25% loss is not canceled by a 25% gain on the remaining capital.',
 limit:'Arithmetic-only illustration; ignores cash flows, transaction costs and investment suitability.',
 source:'https://www.investor.gov/introduction-investing',
 predict:'What happens to the required percentage recovery as the original loss approaches 100%?',
 assess:'Explain why the recovery percentage uses the remaining value as its denominator.',
 cases:[
 N('recovery','Fictional account declines 20%. What percentage gain on the remaining value exactly restores the original amount?',{loss:20},'percent','80 remains from 100; 20÷80×100 = 25%.'),
 N('recovery','A separate fictional balance loses 40%. What percentage increase from the new base is needed to break even?',{loss:40},'percent','60 remains from 100; 40÷60×100 = 66.6667%.'),
 N('recovery','Transfer: after a hypothetical 10% loss, determine the percent gain needed on the remaining 90%.',{loss:10},'percent','10÷90×100 = 11.1111%.')
 ]},
{slug:'knowledge-b002-market-cap-versus-share-price',title:'Why Share Price Is Not Market Capitalization',
 concept:'Equity market capitalization equals the current per-share market price times total shares outstanding. A low share price does not by itself mean a small company.',
 teach:'Share counts, share classes and reporting dates need verification. A stock split can change per-share price and share count without mechanically changing company value.',
 mistake:'Comparing two companies solely by per-share price ignores outstanding shares.',
 limit:'Market capitalization is not enterprise value and is not an estimate of intrinsic worth.',
 source:'https://www.investor.gov/introduction-investing/investing-basics/glossary/market-capitalization',
 predict:'A company halves its share price through a 2-for-1 split while doubling shares outstanding. What happens mechanically to market cap?',
 assess:'Why can a $5 stock represent a larger company than a $100 stock?',
 cases:[
 N('marketCap','Fictional issuer has 12 million shares outstanding at $8 each. What is the market cap in millions of dollars?',{sharesMillion:12,price:8},'million USD','12 million × $8 = $96 million.'),
 N('marketCap','Second fictional issuer: 40 million shares at $3.50. Compute market capitalization in millions.',{sharesMillion:40,price:3.5},'million USD','40×3.50 = $140 million.'),
 N('marketCap','Transfer: 7.5 million shares and price $24. Compute market capitalization in millions.',{sharesMillion:7.5,price:24},'million USD','7.5×24 = $180 million.')
 ]},
{slug:'knowledge-b002-dollar-cost-averaging-quantity',title:'Dollar-Cost Averaging and Shares Acquired',
 concept:'Dollar-cost averaging invests equal dollar amounts at scheduled intervals. Each investment buys amount ÷ price shares, so lower prices buy more shares.',
 teach:'The total number of shares is the sum of separate quantities; it is not computed by dividing all deposits by a simple average of prices.',
 mistake:'Regular periodic investing does not ensure profit or prevent a loss.',
 limit:'Fictional case assumes fractional purchases, zero fees and immediately executable listed prices.',
 source:'https://www.investor.gov/introduction-investing/investing-basics/glossary/dollar-cost-averaging',
 predict:'With the same $100 contribution, do you acquire more shares at $10 or at $20?',
 assess:'Why should each purchase quantity be calculated with its own transaction price?',
 cases:[
 N('dca','Two fictional $100 contributions occur at $10 and $20 per share. Calculate total shares acquired.',{amount:100,p1:10,p2:20},'shares','100÷10 + 100÷20 = 10+5 = 15 shares.'),
 N('dca','A separate plan contributes $120 twice, at prices $12 then $8. Calculate total shares.',{amount:120,p1:12,p2:8},'shares','120÷12 + 120÷8 = 10+15 = 25 shares.'),
 N('dca','Transfer: two $75 deposits at $15 and $25. How many fractional/whole shares altogether?',{amount:75,p1:15,p2:25},'shares','75÷15 + 75÷25 = 5+3 = 8 shares.')
 ]},
{slug:'knowledge-b002-trade-profit-after-costs',title:'Trade Proceeds, Entry Cost, and Net Profit',
 concept:'For equal share quantities, fictional net result = shares × (sell price − buy price) − entry fee − exit fee.',
 teach:'Separate gross revenue, acquisition cost, and explicit fees. Actual results can also depend on other costs, tax, and partial fills.',
 mistake:'A positive sale-minus-entry difference is not necessarily a positive net result after costs.',
 limit:'No actual transaction, taxes or complex multi-lot basis is represented.',
 source:'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders',
 predict:'What could turn a small positive gross trading difference into a negative net outcome?',
 assess:'What inputs are required to reconstruct a completed net trade result from execution records?',
 cases:[
 N('netProfit','Fictional: 20 shares bought at $10, sold at $10.60, $2 entry fee and $2 exit fee. Find net profit.',{qty:20,buy:10,sell:10.6,entryFee:2,exitFee:2},'USD','20×(10.60−10)−2−2 = $8 net.'),
 N('netProfit','New case: 15 shares bought at $8, sold at $8.40, total $7 in entry/exit fees split $3 and $4. Find net.',{qty:15,buy:8,sell:8.4,entryFee:3,exitFee:4},'USD','15×0.40−3−4 = −$1.'),
 N('netProfit','Transfer: 50 shares bought $5.20, sold $5.00, $1 fee each way. Determine signed net result.',{qty:50,buy:5.2,sell:5,entryFee:1,exitFee:1},'USD','50×(5.00−5.20)−1−1 = −$12.')
 ]},
{slug:'research-study-ema',title:'Exponential Moving Average — calculation and chart interpretation',
 concept:'EMA(t)=α×close(t)+(1−α)×EMA(t−1), with α=2/(N+1) after an established, correctly initialized prior EMA.',
 teach:'A single new candle is not enough to initialize the EMA. These examples provide a previously warmed EMA and one completed new close.',
 mistake:'An EMA crossover is a lagging calculation, not a guaranteed future trading signal.',
 limit:'Warmup history, adjusted data and session/interval rules determine the plotted line.',
 source:'https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential',
 predict:'How will a properly initialized EMA9 react compared with EMA20 to the same newly completed price change?',
 assess:'Why must you know the EMA period and seed history before comparing numerical outputs?',
 cases:[
 N('ema','Given a warmed EMA9 of $10 and a newly completed close of $11, compute the updated EMA9.',{period:9,previous:10,close:11},'USD','α=2÷10=0.2; new EMA=10+0.2×(11−10)=$10.20.'),
 N('ema','Warmed EMA19 is $25. A new completed close is $23. Compute the updated EMA19.',{period:19,previous:25,close:23},'USD','α=2÷20=0.1; EMA=25+0.1×(23−25)=$24.80.'),
 N('ema','Transfer: warmed EMA4 is $8 and next completed close is $9.50. Compute the next EMA.',{period:4,previous:8,close:9.5},'USD','α=2÷5=0.4; EMA=8+0.4×1.5=$8.60.')
 ]},
{slug:'research-study-vwap',title:'Volume Weighted Average Price — calculation and chart interpretation',
 concept:'Exact trade-print VWAP = sum of trade price × shares divided by sum of shares over an explicitly defined session.',
 teach:'The exercise uses fictional individual trades. Candle-level HLC3-weighted estimates are proxies, not exact transaction VWAP.',
 mistake:'Do not label a two-print example as the complete session VWAP for an actual security.',
 limit:'Trade eligibility, transaction corrections, zero-volume denominators and reset boundaries must be specified.',
 source:'https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/volume-weighted-average-price-vwap',
 predict:'If additional shares trade at a price above the current VWAP, how might the weighted mean change?',
 assess:'Explain what data is missing when only OHLCV bars, not individual trades, are available.',
 cases:[
 N('vwap','Two fictional eligible trades: 200 shares at $8 and 100 at $10. Find the two-trade weighted mean.',{q1:200,p1:8,q2:100,p2:10},'USD','(200×8+100×10)÷300 = $8.6667. This is not a full-session historical VWAP.'),
 N('vwap','New trade sample: 150 shares at $9 and 250 shares at $11. Find transaction-weighted average.',{q1:150,p1:9,q2:250,p2:11},'USD','(1350+2750)÷400 = $10.25.'),
 N('vwap','Transfer: 80 shares at $12.50 and 120 at $14. Find the weighted mean.',{q1:80,p1:12.5,q2:120,p2:14},'USD','(1000+1680)÷200 = $13.40.')
 ]},
{slug:'research-study-atr',title:'Average True Range — calculation and chart interpretation',
 concept:'True Range = max(high−low, |high−previous close|, |low−previous close|). Given a correctly warmed ATR, Wilder update = ((N−1)×previous ATR + current TR) ÷ N.',
 teach:'First compute current true range using the prior close. Then smooth it. ATR measures historical range magnitude; it has no directional sign.',
 mistake:'High minus low alone can miss an overnight gap.',
 limit:'Price adjustments, period, seed and prior-close continuity must be declared; this exercise supplies a valid warmup.',
 source:'https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/true-range',
 predict:'A gap makes the previous close lie outside the latest high-low range. Could true range exceed the candle range?',
 assess:'Why is ATR not equivalent to the probability of a future price move?',
 cases:[
 N('atr','Prior close $10, current high $12, low $11, warmed ATR3 $1.00. Find next ATR3 using Wilder smoothing.',{priorClose:10,high:12,low:11,period:3,previousAtr:1},'USD','TR=max(1,2,1)=2; ATR3=(2×1+2)÷3=$1.3333.'),
 N('atr','Prior close $20, high $20.80, low $19.90, warmed ATR4 $1.20. Calculate updated ATR4.',{priorClose:20,high:20.8,low:19.9,period:4,previousAtr:1.2},'USD','TR=max(0.9,0.8,0.1)=0.9; ATR4=(3×1.2+0.9)÷4=$1.125.'),
 N('atr','Transfer: prior close $8, high $7.80, low $7.20, warmed ATR5 $0.90. Compute next ATR5.',{priorClose:8,high:7.8,low:7.2,period:5,previousAtr:0.9},'USD','TR=max(0.6,0.2,0.8)=0.8; ATR5=(4×0.9+0.8)÷5=$0.88.')
 ]},
{slug:'research-study-bollinger-bands',title:'Bollinger Bands — calculation and chart interpretation',
 concept:'A Bollinger-style upper band is mean completed close + multiplier × standard deviation of those closes. This exercise explicitly uses population standard deviation.',
 teach:'State the period and SD divisor convention. Different chart platforms and parameter settings can yield different numerical bands.',
 mistake:'Crossing a band is not a prediction that price must reverse.',
 limit:'Short fictional four-close calculations are teaching cases, not the standard 20-period production setting.',
 source:'https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/bollinger-bands',
 predict:'If the same mean stays fixed while price dispersion increases, what happens to the band width?',
 assess:'Why must an analyst disclose whether the SD divisor is N or N−1?',
 cases:[
 N('bollingerUpper','Four fictional completed closes: [10,12,10,12]. Population SD and multiplier 2. Calculate the upper band.',{closes:[10,12,10,12],factor:2},'USD','Mean=11; population SD=1; upper=11+2×1=$13.'),
 N('bollingerUpper','Four closes: [8,8,12,12], population SD, multiplier 1. Calculate upper band.',{closes:[8,8,12,12],factor:1},'USD','Mean=10; population SD=2; upper=10+1×2=$12.'),
 N('bollingerUpper','Transfer: four closes [15,17,15,17] with population SD and multiplier 2. Find upper band.',{closes:[15,17,15,17],factor:2},'USD','Mean=16; population SD=1; upper=16+2×1=$18.')
 ]},
{slug:'research-study-rsi',title:'Relative Strength Index — calculation and chart interpretation',
 concept:'Given correctly computed average gains and losses, RS = average gain ÷ average loss, RSI = 100 − 100/(1+RS).',
 teach:'The provided averages are precomputed from a declared valid window and smoothing method. A complete RSI series requires sequential changes, seed and Wilder-style updates.',
 mistake:'An RSI over 70 is not a guarantee that the next candle will decline.',
 limit:'Zero average loss needs explicit edge-case handling. None of these fictional examples have that edge case.',
 source:'https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/relative-strength-index-rsi',
 predict:'If average gains rise relative to average losses, how does the RSI value generally change?',
 assess:'Explain why you cannot calculate a fully initialized 14-period RSI from one OHLC bar.',
 cases:[
 N('rsi','A fictional initialized window has average gain 0.75 and average loss 0.25. Calculate RSI.',{gain:0.75,loss:0.25},'RSI points','RS=3; RSI=100−100/(1+3)=75.'),
 N('rsi','Different fictional initialized window: average gain 0.40, average loss 0.60. Compute RSI.',{gain:0.4,loss:0.6},'RSI points','RS=2/3; RSI=100−100/(1+2/3)=40.'),
 N('rsi','Transfer: average gain 0.20, average loss 0.80. Compute RSI.',{gain:0.2,loss:0.8},'RSI points','RS=0.25; RSI=100−100/1.25=20.')
 ]},
{slug:'knowledge-b002-balance-sheet-accounting-identity',title:'Assets, Liabilities, and Owners Equity',
 concept:'At a specified reporting date, the basic balance-sheet identity is assets = liabilities + owners’ equity.',
 teach:'Equity in this accounting identity is a residual book amount, not automatically the market capitalization or liquidation proceeds.',
 mistake:'Comparing figures from different reporting dates can produce a meaningless reconciliation.',
 limit:'The supplied totals are fictional and are not values from a public issuer filing.',
 source:'https://www.investor.gov/introduction-investing/getting-started/researching-investments/how-read-10-k',
 predict:'If liabilities rise while assets are unchanged, what happens mechanically to book equity?',
 assess:'How would you verify that the figures in a real issuer filing cover the same reporting date?',
 cases:[
 N('equity','Fictional balance sheet: assets $500 million and liabilities $320 million. Determine book equity in millions.',{assets:500,liabilities:320},'million USD','500−320 = $180 million of book equity.'),
 N('equity','New fictional balance sheet: assets $78 million, liabilities $50 million. Find equity.',{assets:78,liabilities:50},'million USD','78−50 = $28 million.'),
 N('equity','Transfer: fictional assets $210 million, liabilities $227 million. What signed equity results?',{assets:210,liabilities:227},'million USD','210−227 = −$17 million; negative book equity is possible.')
 ]},
{slug:'knowledge-b002-fractional-share-exposure',title:'Fractional Shares, Quantity, and Economic Exposure',
 concept:'The fictional gross market value of an equity position is owned share quantity multiplied by price per share, including fractional quantities.',
 teach:'Fractional exposure is a dollar amount, not an expectation of a proportional voting or service entitlement. Brokerage programs have different fractional-share terms.',
 mistake:'Owning 0.25 share of a $200 stock does not mean the stock itself costs $50 per share.',
 limit:'Ignoring fees, dividends, price movement and fractional-share order execution restrictions.',
 source:'https://www.investor.gov/introduction-investing/investing-basics/investment-products',
 predict:'How does the fictional market value change if share quantity stays fixed and the quoted price doubles?',
 assess:'What is the difference between a fraction of a share and the share price itself?',
 cases:[
 N('fractional','Fictional holding: 0.25 share priced $200 per whole share. Calculate gross position value.',{qty:0.25,price:200},'USD','0.25×$200=$50 gross exposure.'),
 N('fractional','Second holding: 1.75 shares at $24 each. Find gross market value.',{qty:1.75,price:24},'USD','1.75×$24=$42 gross exposure.'),
 N('fractional','Transfer: 0.625 share at $80 per whole share. Calculate gross value.',{qty:0.625,price:80},'USD','0.625×$80=$50 gross exposure.')
 ]}
];
const map=Object.create(null);
for(const lesson of L){
 if(map[lesson.slug])throw Error('Duplicate interactive lesson slug: '+lesson.slug);
 if(lesson.cases.length!==3||!lesson.cases.every(c=>c.prompt&&c.why))throw Error('Incomplete original teaching cases: '+lesson.slug);
 map[lesson.slug]=Object.freeze({...lesson,cases:Object.freeze(lesson.cases.map(x=>Object.freeze(x))),checkedOn:'2026-11-04',
 status:'ORIGINAL_UNGRADED_BETA_REQUIRES_INDEPENDENT_EDITORIAL_AND_MEMBER_ACCEPTANCE'});
}
root.CrownlightKdbWave1=Object.freeze(map);
})(window);
