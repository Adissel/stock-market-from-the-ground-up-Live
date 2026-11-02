package org.smfgu.research;
/**
 * Independent, offline Java validation of fictional OHLCV data.
 * Not deployed as a paid server or replacement for Cloudflare Workers.
 */
public final class MarketDataValidator {
    private MarketDataValidator() {}
    public record Bar(long timestamp, double open, double high, double low, double close, double volume) {}
    public static void validate(Bar[] bars) {
        if (bars == null) throw new IllegalArgumentException("bars required");
        long previous = Long.MIN_VALUE;
        for (Bar b : bars) {
            if (b == null || b.timestamp() <= previous
               || !Double.isFinite(b.open()) || !Double.isFinite(b.high())
               || !Double.isFinite(b.low()) || !Double.isFinite(b.close())
               || !Double.isFinite(b.volume()) || b.volume()<0
               || b.high()<Math.max(b.open(), b.close())
               || b.low()>Math.min(b.open(),b.close())
               || b.low()>b.high()) throw new IllegalArgumentException("invalid OHLCV data");
            previous=b.timestamp();
        }
    }
    /** Bar-derived HLC3 VWAP approximation, not trade-print VWAP. */
    public static double hlc3Vwap(Bar[] bars) {
        validate(bars);
        double sum=0, volume=0;
        for (Bar b:bars) {
            sum+=((b.high()+b.low()+b.close())/3d)*b.volume();
            volume+=b.volume();
        }
        return volume==0?Double.NaN:sum/volume;
    }
    public static void main(String[] args) {
        Bar[] bars={new Bar(1,10,11,9,10,100),new Bar(2,12,13,11,12,200)};
        if(Math.abs(hlc3Vwap(bars)- (3400d/300d))>1e-9)throw new AssertionError("VWAP mismatch");
        System.out.println("PASS: Java OHLCV contract validation");
    }
}
