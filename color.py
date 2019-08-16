"""
Color

Color class that allows you to initialize a color in any of HSV, HSL, HSI, RGB, Hex color spaces.  Once initialized, the corresponding RGBW values are calculated and you may modify the object in RGB or HSV color spaces( ie: by re-setting any component of HSV or RGB (ie, just resetting the R value) and all RGB/HSV/RGBW values will be recalculated.  As of now, you can not work in RGBW directly as we have not written the conversions from RGBW back to one of the standard color spaces. (annoying, but so it goes).


The main goal of this class is to translate various color spaces into RGBW for use in RGBW pixels.
NOTE! this package will not control 3 channel RGB LEDs properly.

The color representation is maintained in HSV interanlly and translated to RGB (and RGBW, but only for retrieval).  
Use whichever is more convenient at the time - RGB for familiarity, HSV to fade colors easily.

RGB values range from 0 to 255
HSV values range from 0.0 to 1.0 *Note the H value has been normalized to range between 0-1 in instead of 0-360 to allow for easier cycling of values.
HSL/HSI values range from 0-360 for H, 0-1 for S/[L|I]

    >>> red   = RGB(255, 0 ,0)  (RGBW = 255,0,0,0)
    >>> green = HSV(0.33, 1.0, 1.0) (RGBW = 5, 254, 0, 0)
    >>> fuschia = RGB(180, 48, 229) (RGBW = 130, 0 , 182, 47)

Colors may also be specified as hexadecimal string:

    >>> blue  = Hex('#0000ff')

Both RGB and HSV components are available as attributes
and may be set.

    >>> red.rgb_r
    255

    >>> red.rgb_g = 128
    >>> red.rgb
    (255, 128, 0)

    >>> red.hsv
    (0.08366013071895424, 1.0, 1.0)

These objects are mutable, so you may want to make a
copy before changing a Color that may be shared

    >>> red = RGB(255,0,0)
    >>> purple = red.copy()
    >>> purple.rgb_b = 255
    >>> red.rgb
    (255, 0, 0)
    >>> purple.rgb
    (255, 0, 255)

Brightness can be adjusted by setting the 'v' property, even
when you're working in RGB.

For example: to gradually dim a color
(ranges from 0.0 to 1.0)

    >>> col = RGB(0,255,0)
    >>> while col.v > 0:
    ...   print col.rgb
    ...   col.v -= 0.1
    ... 
    (0, 255, 0)
    (0, 229, 0)
    (0, 204, 0)
    (0, 178, 0)
    (0, 153, 0)
    (0, 127, 0)
    (0, 102, 0)
    (0, 76, 0)
    (0, 51, 0)
    (0, 25, 0)

RGBW

To get the (r,g,b,w) tuples back from a Color object, simply call Color.rgbw and you will return the (r,g,b,w) tuple.

"""
import colorsys
from math import cos, fmod, pi
from copy import deepcopy
from typing import Tuple

__all__=['RGB', 'HSV', 'Hex', 'Color', 'HSI', 'RGBW']


def clamp(val, min_value, max_value):
    """Restricts a value between a minimum and a maximum value"""
    return max(min(val, max_value), min_value)


def is_hsv_tuple(hsv: Tuple[float, float, float]) -> bool:
    """Checks that HSV values are valid."""
    return all([(0.0 <= t <= 1.0) for t in hsv])


def is_hsi_hsl_tuple(hsi: Tuple[float, float, float]) -> bool:
    if hsi[0] < 0 or hsi[0] > 360:
        return False
    if hsi[1] < 0.0 or hsi[1] > 1.0:
        return False
    if hsi[2] < 0.0 or hsi[2] > 1.0:
        return False

    return True


def is_rgbw_tuple(rgbw: Tuple[int, int, int, int]) -> bool:
    """Checks that RGBW values are valid."""
    return all([(0 <= t <= 255) for t in rgbw])


def is_rgb_tuple(rgb: Tuple[int, int, int]) -> bool:
    """Checks that RGB values are valid."""
    return all([(0 <= t <= 255) for t in rgb])


def rgb_to_hsv(rgb: Tuple[int, int, int]) -> Tuple[float, float, float]:
    """Converts RGB[0-255] to HSV[0.0-1.0]."""
    f = 255.0
    return colorsys.rgb_to_hsv(rgb[0]/f, rgb[1]/f, rgb[2]/f)


def hsv_to_rgb(hsv):
    assert is_hsv_tuple(hsv), "malformed hsv tuple:" + str(hsv)
    _rgb = colorsys.hsv_to_rgb(*hsv)
    r = int(_rgb[0] * 0xff)
    g = int(_rgb[1] * 0xff)
    b = int(_rgb[2] * 0xff)
    return r, g, b


def constrain(val, min, max):
    ret = val
    if val <= min:
        ret = min
    if val >= max:
        ret = max
    return ret


# https://www.neltnerlabs.com/saikoled/how-to-convert-from-hsi-to-rgb-white
def hsi2rgb(hue: float, saturation: float, intensity: float) -> Tuple[int, int, int]:
    hue = fmod(hue, 360.0)
    hue = pi * hue / 180.0
    saturation = constrain(saturation, 0.0, 1.0)
    intensity = constrain(intensity, 0.0, 1.0)

    if hue < 2.09439:
        r = 255.0 * intensity / 3.0 * (1.0 + saturation * cos(hue) / cos(1.047196667 - hue))
        g = 255.0 * intensity / 3.0 * (1.0 + saturation * (1.0 - cos(hue) / cos(1.047196667 - hue)))
        b = 255.0 * intensity / 3.0 * (1.0 - saturation)
    elif hue < 4.188787:
        hue -= 2.09439
        g = 255.0 * intensity / 3.0 * (1.0 + saturation * cos(hue) / cos(1.047196667 - hue))
        b = 255.0 * intensity / 3.0 * (1.0 + saturation * (1.0 - cos(hue) / cos(1.047196667 - hue)))
        r = 255.0 * intensity / 3.0 * (1.0 - saturation)
    else:
        hue -= 4.188787
        b = 255.0 * intensity / 3.0 * (1.0 + saturation * cos(hue) / cos(1.047196667 - hue))
        r = 255.0 * intensity / 3.0 * (1.0 + saturation * (1.0 - cos(hue) / cos(1.047196667 - hue)))
        g = 255.0 * intensity / 3.0 * (1.0 - saturation)

    # for some reason, the rgb numbers need to be X3...
    r = int(r*3)
    g = int(g*3)
    b = int(b*3)

    return constrain(r, 0, 255), constrain(g, 0, 255), constrain(b, 0, 255)


# https://www.neltnerlabs.com/saikoled/how-to-convert-from-hsi-to-rgb-white
def hsi2rgbw(hue: float, saturation: float, intensity: float) -> Tuple[int, int, int, int]:
    hue = fmod(hue, 360)  # cycle H around to 0-360 degrees
    hue = pi * hue / 180.0  # Convert to radians
    saturation = constrain(saturation, 0.0, 1.0)
    intensity = constrain(intensity, 0.0, 1.0)

    if hue < 2.09439:
        cos_h = cos(hue)
        cos_1047_h = cos(1.047196667 - hue)
        r = saturation * 255.0 * intensity / 3.0 * (1.0 + cos_h / cos_1047_h)
        g = saturation * 255.0 * intensity / 3.0 * (1.0 + (1.0 - cos_h / cos_1047_h))
        b = 0.0
        w = 255.0 * (1.0 - saturation) * intensity
    elif hue < 4.188787:
        hue = hue - 2.09439
        cos_h = cos(hue)
        cos_1047_h = cos(1.047196667 - hue)
        g = saturation * 255.0 * intensity / 3.0 * (1.0 + cos_h / cos_1047_h)
        b = saturation * 255.0 * intensity / 3.0 * (1.0 + (1.0 - cos_h / cos_1047_h))
        r = 0.0
        w = 255.0 * (1.0 - saturation) * intensity
    else:
        hue = hue - 4.188787
        cos_h = cos(hue)
        cos_1047_h = cos(1.047196667 - hue)
        b = saturation * 255.0 * intensity / 3.0 * (1.0 + cos_h / cos_1047_h)
        r = saturation * 255.0 * intensity / 3.0 * (1.0 + (1.0 - cos_h / cos_1047_h))
        g = 0.0
        w = 255.0 * (1.0 - saturation) * intensity

    # for some reason, the rgb numbers need to be X3...
    r = int(r * 3)
    g = int(g * 3)
    b = int(b * 3)

    return constrain(r, 0, 255), constrain(g, 0, 255), constrain(b, 0, 255), constrain(w, 0, 255)


# https://en.wikipedia.org/wiki/HSL_and_HSV
def hsv2hsl(hue: float, saturation: float, value: float) -> Tuple[float, float, float]:
    hue = constrain(hue, 0.0, 360.0)
    saturation = constrain(saturation, 0.0, 1.0)
    value = constrain(value, 0.0, 1.0)

    hsl_lightness = value - (value * saturation / 2.0)
    hsl_saturation = 0
    if 0.0 < hsl_lightness < 1.0:
        hsl_saturation = (value - hsl_lightness) / min(hsl_lightness, 1.0 - hsl_lightness)

    return hue, hsl_lightness, hsl_saturation


# https://en.wikipedia.org/wiki/HSL_and_HSV
def hsl2hsv(hue: float, saturation: float, lightness: float) -> Tuple[float, float, float]:
    hue = constrain(hue, 0.0, 360.0)
    saturation = constrain(saturation, 0.0, 1.0)
    lightness = constrain(lightness, 0.0, 1.0)

    hsv_value = lightness + (saturation * min(lightness, 1.0 - lightness))
    hsv_saturation = 0
    if hsv_value > 0.0:
        hsv_saturation = 2.0-(2.0 * lightness / hsv_value)
    return hue, hsv_saturation, hsv_value


# https://en.wikipedia.org/wiki/HSL_and_HSV
def rgb2hsi(r: int, g: int, b: int) -> Tuple[float, float, float]:
    r = constrain(float(r)/255.0, 0.0, 1.0)
    g = constrain(float(g)/255.0, 0.0, 1.0)
    b = constrain(float(b)/255.0, 0.0, 1.0)
    intensity = 0.33333*(r+g+b)

    M = max(r, g, b)
    m = min(r, g, b)

    if intensity == 0.0:
        saturation = 0.0
    else:
        saturation = (1.0-(m/intensity))

    hue = 0
    if M == m:
        hue = 0
    if M == r:
        if M == m:
            hue = 0.0
        else:
            hue = 60.0 * (0.0 + ((g-b) / (M-m)))
    if M == g:
        if M == m:
            hue = 0.0
        else:
            hue = 60.0 * (2.0 + ((b-r) / (M-m)))
    if M == b:
        if M == m:
            hue = 0.0
        else:
            hue = 60.0 * (4.0 + ((r-g) / (M-m)))
    if hue < 0.0:
        hue = hue + 360

    return hue, abs(saturation), intensity


def RGBW(r, g, b, w):
    """Creates RGBW color."""
    raise Exception("Gotcha!  We can't yet reverse calculate RGBW back to any other color spaces.... work in one of the other spaces and get your RGBW values back from Color.rgbw.  Sorry.")


def HSI(h, s, i):
    """Create new HSI color."""
    assert is_hsi_hsl_tuple((h, s, i))
    return RGB(*hsi2rgb(h, s, i))


def RGB(r, g, b, x=False):
    """Create a new RGB color."""
    t = (r, g, b)
    assert is_rgb_tuple(t)
    return Color(rgb_to_hsv(t), x)


def HSV(h, s, v, x=False):
    """Create a new HSV color."""
    return Color((h, s, v), x)


def HSL(h, s, l):
    """Create new HSL color"""
    assert is_hsi_hsl_tuple((h, s, l))
    (h, s, v) = hsl2hsv(h, s, l)
    return Color((constrain(h/360.0, 0.0, 1.0), s, v))


def Hex(value):
    """Create a new Color from a hex string"""
    value = value.lstrip('#')
    lv = len(value)
    rgb_t = (int(value[i:i+int(lv/3)], 16) for i in range(0, lv, int(lv/3)))
    return RGB(*rgb_t)


class Color:
    def __init__(self, hsv_tuple, only_rgb=False):
        self._set_hsv(hsv_tuple)
        self.only_rgb = only_rgb

    def __repr__(self):
        return "rgb=%s hsv=%s" % (self.rgb, self.hsv)

    def copy(self):
        return deepcopy(self)

    def _set_hsv(self, hsv_tuple):
        assert is_hsv_tuple(hsv_tuple)
        # convert to a list for component reassignment
        self.hsv_t = list(hsv_tuple)

    @property
    def rgbw(self) -> Tuple[int, int, int, int]:
        """Returns RGBW values each in the range of 0-255."""
        hsi = rgb2hsi(self.rgb[0], self.rgb[1], self.rgb[2])
        return hsi2rgbw(hsi[0], hsi[1], hsi[2])

    @property
    def rgb(self):
        """Returns an RGB[0-255] tuple."""
        return hsv_to_rgb(self.hsv_t)

    @property
    def hsv(self):
        """Returns a HSV[0.0-1.0] tuple."""
        return tuple(self.hsv_t)

    @property
    def hex(self):
        """Returns a hexadecimal string."""
        return '#%02x%02x%02x' % self.rgb

    @property
    def hsl(self):
        """Returns HSL tuple."""
        (h, s, l) = hsv2hsl(self.hsv_t[0], self.hsv_t[1], self.hsv_t[2])
        h = constrain(h*360.0, 0.0, 360.0)
        return h, s, l

    """
    Properties representing individual HSV components
    Adjusting 'H' shifts the color around the color wheel
    Adjusting 'S' adjusts the saturation of the color
    Adjusting 'V' adjusts the brightness/intensity of the color
    """
    @property
    def h(self):
        return self.hsv_t[0]

    @h.setter
    def h(self, val):
        v = clamp(val, 0.0, 1.0)
        self.hsv_t[0] = round(v, 8)

    @property
    def s(self):
        return self.hsv_t[1]

    @s.setter
    def s(self, val):
        v = clamp(val, 0.0, 1.0)
        self.hsv_t[1] = round(v, 8)

    @property
    def v(self):
        return self.hsv_t[2]

    @v.setter
    def v(self, val):
        v = clamp(val, 0.0, 1.0) 
        self.hsv_t[2] = round(v, 8)

    """
    Properties representing individual RGB components
    """
    @property
    def rgb_r(self):
        return self.rgb[0]

    @rgb_r.setter
    def rgb_r(self, val):
        assert 0 <= val <= 255
        r,g,b = self.rgb
        new = (val, g, b)
        assert is_rgb_tuple(new)
        self._set_hsv(rgb_to_hsv(new))

    @property
    def rgb_g(self):
        return self.rgb[1]

    @rgb_g.setter
    def rgb_g(self, val):
        assert 0 <= val <= 255
        r,g,b = self.rgb
        new = (r, val, b)
        assert is_rgb_tuple(new)
        self._set_hsv(rgb_to_hsv(new))

    @property
    def rgb_b(self):
        return self.rgb[2]

    @rgb_b.setter
    def rgb_b(self, val):
        assert 0 <= val <= 255
        r,g,b = self.rgb
        new = (r, g, val)
        assert is_rgb_tuple(new)
        self._set_hsv(rgb_to_hsv(new))

    """
    Properties representing individual RGBW components
    """
    @property
    def r(self):
        if self.only_rgb:
            return self.rgb[0]
        else:
            return self.rgbw[0]

    @property
    def g(self):
        if self.only_rgb:
            return self.rgb[1]
        else:
            return self.rgbw[1]

    @property
    def b(self):
        if self.only_rgb:
            return self.rgb[2]
        else:
            return self.rgbw[2]

    @property
    def w(self):
        if self.only_rgb:
            return 0
        else:
            return self.rgbw[3]


if __name__ == '__main__':
    import doctest
    doctest.testmod()
