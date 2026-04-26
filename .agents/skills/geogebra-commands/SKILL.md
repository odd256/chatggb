---
name: geogebra-commands
description: |
  Complete GeoGebra command reference for use with evalCommand() API.
  Contains syntax, parameters, and examples for all GeoGebra commands.
  Use when generating GeoGebra commands from natural language descriptions,
  looking up specific command syntax, or verifying command availability.
  Triggers on: GeoGebra commands, GGB command, geometric construction,
  graphing calculator, evalCommand.
---

# GeoGebra Commands Reference

> Complete command reference extracted from the official GeoGebra manual.
> All commands can be passed to `applet.evalCommand(cmd)` in the GeoGebra JS API.

## Statistics Commands

- **ANOVA( <List>, <List>, ...)** | Performs a one-way https://en.wikipedia.org/wiki/Anova[ANOVA] test on the given lists of numbers. Results are returned i...
- **ChiSquaredTest( <Matrix>  | ChiSquaredTest)** | Performs a https://en.wikipedia.org/wiki/Chi-squared_test[chi-squared test] that compares the given matrix of observed c... e.g. ChiSquaredTest({{1, 2, 1}, {3, 2, 3}}) yields _{0.69, 0.75}_.
- **Classes( <List of Data>, <Start>, <Width of Classes>  | Classes)** | Gives a list of class boundaries. The first boundary (min) is equal to _Start_, the last boundary (max) will be at least... e.g. Classes({0.1, 0.2, 0.4, 1.1}, 0, 1) gives {0, 1, 2}
- **CorrelationCoefficient( <List of x-coordinates>, <List of y-coordinates>  | CorrelationCoefficient)** | Calculates the product moment correlation coefficient using the given _x_- and _y_-coordinates. e.g. CorrelationCoefficient({1, 3, 2, 1, 5, 2}, {1, 6, 4, 3, 3, 2}) yields _0.36_.
- **Covariance( <List of Numbers>, <List of Numbers>  | Covariance)** | Calculates the covariance between the elements of the specified lists. e.g. Covariance({1, 2, 3}, {1, 3, 7}) yields _2_, the covariance of _{1, 2, 3}_ and _
- **Fit( <List of Points>, <List of Functions>  | Fit)** | Returns a linear combination of the _functions_ that best fit the _points_ in the list. e.g. * Fit({(-2, 3), (0, 1), (2, 1), (2, 3)}, {x^2, x}) yields _0.625 x^2 - 0.25x_. *
- **FitExp( <List of Points> )** | Calculates the exponential regression curve in the form _aℯ^bx^_. e.g. FitExp({(0, 1), (2, 3), (4, 3), (6, 4)}) yields _1.31ℯ^0.21x^_.
- **FitGrowth( <List of Points> )** | Calculates a function of the form stem:[ a b ^ x ] to the points in the list. (Very similar to xref:/commands/FitExp.ado... e.g. FitGrowth({(0, 1), (2, 3), (4, 3), (6, 4)}) yields _1.31_ stem:[ \cdot ] _1.23^x
- **FitImplicit( <List of Points>, <Order> )** | Attempts to find a best-fit implicit curve of order n ≥ 2 through the points. You need at least stem:[\frac{n(n+3)}2] po...
- **FitLine( <List of Points>  | FitLine)** | Calculates the _y_ on _x_ regression line of the points. == CAS Syntax e.g. FitLine({(-2, 1), (1, 2), (2, 4), (4, 3), (5, 4)}) yields _0.4x + 2_.
- **FitLineX( <List of Points>  | FitLineX)** | Calculates the _x_ on _y_ regression line of the points. == CAS Syntax e.g. FitLineX({(-1, 3), (2, 1), (3, 4), (5, 3), (6, 5)}) yields _1.1x - 0.1_.
- **FitLog( <List of Points>  | FitLog)** | Calculates the logarithmic regression curve. == CAS Syntax e.g. FitLog({(ℯ, 1), (ℯ^2, 4)}) yields _-2 + 3 ln(x)_.
- **FitLogistic( <List of Points> )** | Calculates the regression curve in the form stem:[\frac{a}{1+b e^{-kx}}]. e.g. FitLogistic({(-6, 2), (0, 2), (3, 4), (3.4, 8)}) yields stem:[ \frac{1.98}{1 - 0
- **FitPoly( <List of Points>, <Degree of Polynomial>  | FitPoly)** | Calculates the polynomial regression model of given _degree_ that fits the specified _points_. e.g. FitPoly({(-1, -1), (0, 1), (1, 1), (2, 5)}, 3) yields _f(x) = x^3^ - 1 x^2^ + 1_
- **FitPow( <List of Points>  | FitPow)** | Calculates the regression curve in the form _a x^b^_. == CAS Syntax e.g. FitPow({(1, 1), (3, 2), (7, 4)}) creates the regression curve _f(x) = 0.97 x^0.7
- **FitSin( <List of Points> )** | Calculates the regression curve in the form _a + b sin (c x + d)_. e.g. FitSin({(1, 1), (2, 2), (3, 1), (4, 0), (5, 1), (6, 2)}) yields _f(x) = 1 + 1 si
- **Frequency( <List of Raw Data>  | Frequency)** | Returns a list with a count of the occurrences of each unique value in the given list of data. This input list can be nu... e.g. Enter list1 = { "a", "a", "x", "x", "x", "b" }. Frequency(list1) returns the lis
- **FrequencyPolygon( <List of Class Boundaries>, <List of Heights>  | FrequencyPolygon)** | Creates a frequency polygon with vertices in given heights. The class boundaries determine the x-coordinate of each vert... e.g. FrequencyPolygon({0, 1, 2, 3, 4, 5}, {2, 6, 8, 3, 1}) creates the corresponding 
- **GeometricMean(List of Numbers)** | Returns the https://en.wikipedia.org/wiki/Geometric_mean[geometric mean] of given list of numbers. e.g. GeometricMean({13, 7, 26, 5, 19}) yields _11.76_.
- **HarmonicMean( <List of Numbers> )** | Returns the https://en.wikipedia.org/wiki/Harmonic_mean[harmonic mean] of given list of numbers. e.g. HarmonicMean({13, 7, 26, 5, 19}) yields _9.79_.
- **MAD( <List of Numbers>  | MAD)** | Calculates the https://en.wikipedia.org/wiki/Average_absolute_deviation[Mean Absolute Deviation] of the numbers in the l... e.g. MAD({1, 2, 3, 4, 5}) yields _1.2_
- **Max( <List>  | Max)** | Returns the maximum of the numbers within the list. e.g. Max({-2, 12, -23, 17, 15}) yields _17_.
- **Mean( <List of Raw Data>  | Mean)** | Calculates the arithmetic mean of list elements. e.g. * Mean({1, 2, 3, 2, 4, 1, 3, 2}) yields _a = 2.25_ and * Mean({1, 3, 5, 9, 13}) 
- **MeanX( <List of Points> )** | Calculates the mean of the _x_-coordinates of the points in the list. e.g. MeanX({(0,0), (3,2), (5,1), (2,1), (2,4)}) yields _2.4_
- **MeanY( <List of Points> )** | Calculates the mean of the _y_-coordinates of the points in the list. e.g. MeanY({(0,0), (3,2), (5,1), (2,1), (2,4)}) yields _1.6_
- **Median( <List of Raw Data>  | Median)** | Determines the median of the list elements. e.g. * Median({1, 2, 3}) yields _2_. * Median({1, 1, 8, 8}) yields _4.5_.
- **Min( <List>  | Min)** | Returns the minimum of the numbers within the list. e.g. Min({-2, 12, -23, 17, 15}) yields _-23_.
- **Mode( <List of Numbers> )** | Determines the mode(s) of the list elements. e.g. * Mode({1, 2, 3, 4}) returns an empty list _{}_. * Mode({1, 1, 1, 2, 3, 4}) retu
- **Normalize( <List of Numbers>  | Normalize)** | Returns a list containing the _normalized_ form of the given numbers. e.g. Normalize({1, 2, 3, 4, 5}) returns _{0, 0.25, 0.5, 0.75, 1}_.
- **Percentile( <List of Numbers>, <Percent> )** | Let _P_ equal the given _Percent_. Returns the value that cuts off the first _P_ percent of the _list of numbers_, when ... e.g. Percentile({1, 2, 3, 4}, 0.25) yields _1.25_.
- **Product( <List of Raw Data>  | Product)** | Calculates the product of all numbers in the list. e.g. Product({2, 5, 8}) yields _80_.
- **Quartile1( <List of Raw Data>  | Quartile1)** | Determines the lower quartile of the list elements. e.g. Quartile1({1, 2, 3, 4}) yields _1.5_.
- **Quartile3( <List of Raw Data>  | Quartile3)** | Determines the upper quartile of the list elements. e.g. Quartile3({1, 2, 3, 4}) yields _3.5_.
- **RSquare( <List of Points>, <Function> )** | Calculates the https://en.wikipedia.org/wiki/Coefficient_of_determination[coefficient of determination] _R² = 1 - xref:/... e.g. RSquare({(-3, 2), (-2, 1), (-1, 3), (0, 4), (1, 2), (2, 4), (3, 3), (4, 5), (6, 
- **RootMeanSquare( <List of Numbers> )** | Returns the https://en.wikipedia.org/wiki/Root_mean_square[root mean square] of given list of numbers. e.g. RootMeanSquare({3, 4, 5, 3, 2, 3, 4}) yields _3.5456_.
- **SD( <List of Raw Data>  | SD)** | Calculates the https://en.wikipedia.org/wiki/Standard_deviation[standard deviation] of the numbers in the list. e.g. * SD({1, 2, 3, 4, 5}) yields _1.41_ * stdevp({1, 2, 3, 4, 5}) yields _1.41_
- **SDX( <List of Points> )** | Returns the https://en.wikipedia.org/wiki/Standard_deviation[standard deviation] of the _x_-coordinates of the points in... e.g. SDX({(1, 1), (2, 2), (3, 1), (3, 3), (4, 2), (3, -1)}) yields _a = 0.94_.
- **SDY( <List of Points> )** | Returns the https://en.wikipedia.org/wiki/Standard_deviation[standard deviation] of the _y_-coordinates of the points in... e.g. SDY({(1, 1), (2, 2), (3, 1), (3, 3), (4, 2), (3, -1)}) yields _a = 1.25_.
- **Sample( <List>, <Size>  | Sample)** | Returns list of _n_ randomly chosen elements of a list; elements can be chosen several times. e.g. Sample({1, 2, 3, 4, 5}, 5) yields for example _list1 = {1, 2, 1, 5, 4}_.
- **SampleSD( <List of Raw Data>  | SampleSD)** | Returns the https://en.wikipedia.org/wiki/Standard_deviation#Estimation[sample standard deviation] of the given xref:/Li... e.g. * SampleSD({1, 2, 3}) yields _1_. * stdev({1, 2, 3}) yields _1_.
- **SampleSDX( <List of Points> )** | Returns the https://en.wikipedia.org/wiki/Standard_deviation#Estimation[sample standard deviation] of the _x_-coordinate... e.g. SampleSDX({(2, 3), (1, 5), (3, 6), (4, 2), (1, 1), (2, 5)}) yields _a = 1.17_.
- **SampleSDY( <List of Points> )** | Returns the https://en.wikipedia.org/wiki/Standard_deviation#Estimation[sample standard deviation] of the _y_-coordinate... e.g. SampleSDY({(2, 3), (1, 5), (3, 6), (4, 2), (1, 1), (2, 5)}) yields _a = 1.97_.
- **SampleVariance( <List of Raw Data>  | SampleVariance)** | Returns the https://en.wikipedia.org/wiki/Sample_variance#Population_variance_and_sample_variance[sample variance] of th... e.g. SampleVariance({1, 2, 3, 4, 5}) yields _a = 2.5_.
- **Shuffle( <List>  | Shuffle)** | Returns list with same elements, but in random order. See also xref:/commands/RandomElement.adoc[RandomElement Command] ... e.g. * Shuffle({3, 5, 1, 7, 3}) yields for example _++{5, 1, 3, 3, 7}++_. * Shuffle(S
- **SigmaXX( <List of Points>  | SigmaXX)** | Calculates the sum of squares of the _x_-coordinates of the given points. e.g. Let list1 = {(-3, 4), (-1, 4), (-2, 3), (1, 3), (2, 2), (1, 5)} be a list of poi
- **SigmaXY( <List of Points>  | SigmaXY)** | Calculates the sum of the products of the _x_- and _y_-coordinates. e.g. You can work out the covariance of a list of points using SigmaXY(list)/Length(l
- **SigmaYY( <List of Points> )** | Calculates the sum of squares of _y_-coordinates of the given points. e.g. Let list = {(-3, 4), (-1, 4), (-2, 3), (1, 3), (2, 2), (1, 5)} be a list of poin
- **Spearman( <List of Points>  | Spearman)** | Returns https://en.wikipedia.org/wiki/Spearman%27s_rank_correlation_coefficient[Spearman's rank correlation coefficient]... e.g. Let list = {(-3, 4), (-1, 4), (-2, 3), (1, 3), (2, 2), (1, 5)} be a list of poin
- **Sum( <List>  | Sum)** | Calculates the sum of all the elements in the list. e.g. * Sum({1, 2, 3}) yields the number _a = 6_. * Sum({x^2, x^3}) yields _f(x) = x^2
- **SumSquaredErrors( <List of Points>, <Function> )** | Calculates the sum of squared errors, SSE, between the y-values of the points in the list and the function values of the... e.g. If we have a list of points L={(1, 2), (3, 5),(2, 2), (5, 2), (5, 5)} and have c
- **Sxx( <List of Numbers>  | Sxx)** | Calculates the statistic stem:[\sum x^2 - \frac{(\sum x)^2}{n}].
- **Sxy( <List of Points>  | Sxy)** | Calculates the statistic stem:[\sum xy - \frac{(\sum x) (\sum y)}{n}] using the coordinates of the given points.
- **Syy( <List of Points> )** | Calculates the statistic stem:[ \sum y^2 -\frac{ (\sum y)^2}{n}] using the _y_-coordinates of the given points.
- **TMean2Estimate( <List of Sample Data 1>, <List of Sample Data 2>, <Confidence Level>, <Boolean Pooled>  | TMean2Estimate)** | Calculates a _t_ confidence interval estimate of the difference between two population means using the given sample data...
- **TMeanEstimate( <List of Sample Data>, <Confidence level>  | TMeanEstimate)** | Calculates a _t_ confidence interval estimate of a population mean using the given sample data and confidence level. Res...
- **TTest( <List of Sample Data>, <Hypothesized Mean>, <Tail>  | TTest)** | Performs a one-sample t-test of a population mean using the given list of sample data. _Hypothesized Mean_ is the popula... e.g. TTest({1, 2, 3, 4, 5}, 3, "<") yields _{0.5, 0}_.
- **TTest2( <List of Sample Data 1>, <List of Sample Data 2>, <Tail>, <Boolean Pooled>  | TTest2)** | Performs a t-test of the difference between two population means using the given lists of sample data. Tail has possible...
- **TTestPaired( <List of Sample Data 1>, <List of Sample Data 2>, <Tail> )** | Performs a paired t-test using the given lists of paired sample data. _Tail_ has possible values "<", ">" , "≠" that det... e.g. TTestPaired({1, 2, 3, 4, 5}, {1, 1, 3, 5, 5}, "<") yields _{0.5, 0}_.
- **Variance( <List of Raw Data>  | Variance)** | Calculates the variance of list elements. e.g. Variance({1, 2, 3}) yields _0.67_.
- **ZMean2Estimate( <List of Sample Data 1>, <List of Sample Data 2>, <σ1>, <σ2>, <Confidence Level>  | ZMean2Estimate)** | Calculates a _Z_ confidence interval estimate of the difference between two population means using the given sample data... e.g. Two sample data list1 = {1, 4, 5, 4, 1, 3, 4, 2}, list2 = {2, 1, 3, 1, 2, 5, 2, 
- **ZMean2Test( <List of Sample Data 1>, <σ1>, <List of Sample Data 2>, <σ2>, <Tail>  | ZMean2Test)** | Performs a https://en.wikipedia.org/wiki/Z-test[Z test] of the difference between two population means using the given l...
- **ZMeanEstimate( <List of Sample Data>, <σ>, <Confidence Level>  | ZMeanEstimate)** | Calculates a _Z_ confidence interval estimate of a population mean using the given sample data, the population standard ...
- **ZMeanTest( <List of Sample Data>, <σ>, <Hypothesized Mean>, <Tail>  | ZMeanTest)** | Performs a one sample https://en.wikipedia.org/wiki/Z-test[Z test] of a population mean using the given list of sample d...
- **ZProportion2Estimate( <Sample Proportion 1 >, <Sample Size 1>, <Sample Proportion 2 >, <Sample Size 2>, <Confidence Level> )** | Calculates a Z confidence interval estimate of the difference between two proportions using the given sample statistics ...
- **ZProportion2Test( <Sample Proportion 1>, <Sample Size 1>, <Sample Proportion 2>, <Sample Size 2>, <Tail> )** | Performs a test of the difference between two population proportions using the given sample statistics. _Tail_ has possi...
- **ZProportionEstimate( <Sample Proportion >, <Sample Size >, <Confidence Level> )** | Calculates a _Z_ confidence interval estimate of a population proportion using the given sample statistics and confidenc...
- **ZProportionTest( <Sample Proportion>, <Sample Size>, <Hypothesized Proportion>, <Tail> )** | Performs a one sample _Z_ test of a proportion using the given sample statistics. _Hypothesized Proportion_ is the popul...

## Geometry Commands

- **AffineRatio( <Point A>, <Point B>, <Point C> )** | Returns the affine ratio _λ_ of three collinear points _A_, _B_ and _C_, where _C = A + λ * AB_. e.g. AffineRatio((-1, 1), (1, 1), (4, 1)) yields _2.5_
- **Angle( <Object>  | Angle)** | * *Conic:* Returns the angle of twist of a conic section’s major axis (see command xref:/commands/Axes.adoc[Axes]). * *V... e.g. Angle(x²/4+y²/9=1) yields _90°_ or _1.57_ if the default angle unit is _radians_
- **AngleBisector( <Line>, <Line>  | AngleBisector)** | Returns both angle bisectors of the lines. e.g. AngleBisector(x + y = 1, x - y = 2) yields _a: x = 1.5_ and _b: y = -0.5_.
- **Arc( <Circle>, <Point M >, <Point N>  | Arc)** | Returns the directed arc (counterclockwise) of the given circle, with endpoints M and N.
- **AreCollinear( <Point>, <Point>, <Point> )** | Decides if the points are collinear. Normally this command computes the result numerically. This behavior can be changed... e.g. AreCollinear((1, 2), (3, 4), (5, 6)) yields _true_ since all the three points ly
- **AreConcurrent( <Line>, <Line>, <Line> )** | Decides if the lines are concurrent. If the lines are parallel, they considered to have a common point in infinity, thus... e.g. AreConcurrent(Line((1, 2), (3, 4)), Line((1, 2), (3, 5)), Line((1, 2), (3, 6))) 
- **AreConcyclic( <Point>, <Point>, <Point>, <Point> )** | Decides if the points are concyclic. Normally this command computes the result numerically. This behavior can be changed... e.g. AreConcyclic((1, 2), (3, 4), (1, 4), (3, 2)) yields _true_ since the points are 
- **AreCongruent( <Object>, <Object> )** | Decides if the objects are congruent. Normally this command computes the result numerically. This behavior can be change... e.g. AreCongruent(Circle((0, 0),1),x^2+y^2=1) and AreCongruent(Circle((1, 1),1),x^2+y
- **AreEqual( <Object>, <Object> )** | Decides if the objects are equal. Normally this command computes the result numerically. This behavior can be changed by... e.g. AreEqual(Circle((0, 0),1),x^2+y^2=1) yields _true_ since the two circles have th
- **AreParallel( <Line>, <Line> )** | Decides if the lines are parallel. Normally this command computes the result numerically. This behavior can be changed b... e.g. AreParallel(Line[(1, 2), (3, 4)), Line((5, 6),(7,8))) yields _true_ since the gi
- **ArePerpendicular( <Line>, <Line> )** | Decides if the lines are perpendicular. Normally this command computes the result numerically. This behavior can be chan... e.g. ArePerpendicular(Line((-1, 0), (0, -1)), Line((0, 0),(2,2))) yields _true_ since
- **Area( <Point>, ..., <Point>  | Area)** | Calculates the area of the polygon defined by the given points. e.g. Area((0, 0), (3, 0), (3, 2), (0, 2)) yields _6_.
- **Barycenter( <List of Points>, <List of Weights> )** | Set the center of a system of points in the list, defined as the average of their positions, weighted by their value, us... e.g. * Barycenter({(2, 0), (0, 2), (-2, 0), (0, -2)}, {1, 1, 1, 1}) yields point _A(0
- **Centroid( <Polygon> )** | Returns the centroid of the polygon. e.g. Let A = (1, 4), B = (1, 1), C = (5, 1) and D = (5, 4) be the vertices of a polyg
- **Circle( <Point>, <Radius Number>  | Circle)** | Yields a circle with given center and radius.
- **CircularArc( <Midpoint>, <Point A>, <Point B> )** | Creates a circular arc with midpoint between the two points.
- **CircularSector( <Midpoint>, <Point A>, <Point B> )** | Creates a circular sector with midpoint between the two points.
- **CircumcircularArc( <Point>, <Point>, <Point> )** | Creates a circular arc through three points, where the first point is the starting point and the third point is the endp...
- **CircumcircularSector( <Point>, <Point>, <Point> )** | Creates a circular sector whose arc runs through the three points, where the first point is the starting point and the t...
- **Circumference(Conic)** | If the given conic is a circle or ellipse, this command returns its circumference. Otherwise the result is undefined. e.g. Circumference(x^2 + 2y^2 = 1) yields _5.4_.
- **ClosestPoint( <Path>, <Point>  | ClosestPoint)** | Returns a new point on a xref:/Geometric_Objects.adoc[path] which is the closest to a selected point.
- **ClosestPointRegion( <Region>, <Point> )** | Returns a new point on the xref:/Geometric_Objects.adoc[region] which is the closest to a selected point.
- **CrossRatio( <Point A>, <Point B>, <Point C>, <Point D> )** | Calculates the cross ratio _λ_ of four collinear points _A_, _B_, _C_ and _D_, where: _λ = xref:/commands/AffineRatio.ad... e.g. CrossRatio((-1, 1), (1, 1), (3, 1), (4, 1)) yields _1.2_
- **Cubic( <Point>, <Point>, <Point>, <Number> )** | Gives _n_-th https://bernard-gibert.pagesperso-orange.fr/ctc.html[triangle cubic] of the given triangle _ABC_. == Some c... e.g. Let _A = (0, 1)_, _B = (2, 1)_ and _C = (1, 2)_. Cubic(A, B, C, 2) yields the im
- **Difference( <Polygon>, <Polygon> )** | Finds the difference of the two polygons.
- **Distance( <Point>, <Object>  | Distance)** | Yields the shortest distance between a point and an object. e.g. * Distance((2, 1), x^2 + (y - 1)^2 = 1) yields _1_ * Distance((2, 1, 2), (1, 3, 
- **Envelope( <Path>, <Point> )** | Creates the https://en.wikipedia.org/wiki/Envelope_(mathematics)[envelope] equation of a set of output paths while the m... e.g. https://www.geogebra.org/m/JYJHFyH4[A ladder is leaning against the wall and sli
- **Incircle( <Point>, <Point>, <Point> )** | Returns https://en.wikipedia.org/wiki/Incircle_and_excircles_of_a_triangle[Incircle] of the triangle formed by the three... e.g. Let _O=(0, 0)_, _A=(3, 0)_ and _B=(0, 5)_ be three points: Incircle(O, A, B) yie
- **InteriorAngles( <Polygon> )** | Creates all the interior angles of the given polygon.
- **Intersect( <Object>, <Object>  | Intersect)** | Yields the intersection points of two objects. e.g. * Let a: -3x + 7y = -10 be a line and c: x^2 + 2y^2 = 8 be an ellipse. Intersect
- **IntersectPath( <Line>, <Polygon>  | IntersectPath)** | Creates the intersection path between line and polygon. e.g. IntersectPath(a, triangle) creates a segment between the first and second inters
- **Line( <Point>, <Point>  | Line)** | Creates a line through two points _A_ and _B_.
- **Locus( <Point Creating Locus Line Q>, <Point P> | Locus)** | Returns the locus curve of the point _Q_, which depends on the point _P_.
- **LocusEquation( <Locus>  | LocusEquation)** | Calculates the equation of a Locus and plots this as an Implicit Curve. e.g. Let us construct a parabola as a locus: Create free Points _A_ and _B_, and Line
- **Midpoint( <Segment>  | Midpoint)** | Returns the midpoint of the segment. e.g. Let s = Segment((1, 1), (1, 5)). Midpoint(s) yields _(1, 3)_.
- **PathParameter( <Point On Path> )** | Returns the parameter (i.e. a number ranging from _0_ to _1_) of the point that belongs to a xref:/Geometric_Objects.ado... e.g. Let f(x) = x² + x - 1 and _A_ is a point attached to this function with coordina
- **Perimeter( <Polygon>  | Perimeter)** | Returns the perimeter of the polygon. e.g. Perimeter(Polygon((1, 2), (3, 2), (4, 3))) yields _6.58_.
- **PerpendicularBisector( <Segment>  | PerpendicularBisector)** | Yields the perpendicular bisector of a segment.
- **PerpendicularLine( <Point>, <Line>  | PerpendicularLine)** | Creates a line through the point perpendicular to the given line. e.g. Let c: -3x + 4y = -6 be a line and A = (-2, -3) a point. PerpendicularLine(A, c)
- **Point( <Object>  | Point)** | Returns a point on the geometric object. The resulting point can be moved along the xref:/Geometric_Objects.adoc[path].
- **PointIn( <Region> )** | Returns a point restricted to given xref:/Geometric_Objects.adoc[region].
- **Polygon( <Point>, ..., <Point>  | Polygon)** | Returns a polygon defined by the given points. e.g. Polygon((1, 1), (3, 0), (3, 2), (0, 4)) yields a quadrilateral.
- **Polyline( <List of Points>  | Polyline)** | Creates an open polygonal chain (i.e. a connected series of segments) having the initial vertex in the first point of th... e.g. Polyline((1, 3), (4, 3), (?,?), (6, 2), (4, -2), (2, -2)) yields the value _9.47
- **Prove( <Boolean Expression> )** | Returns whether the given boolean expression is true or false in general. Normally, GeoGebra decides whether a xref:/Boo... e.g. We define three free points, A=(1,2), B=(3,4), C=(5,6). The command AreCollinear
- **ProveDetails( <Boolean Expression> )** | Returns some details of the result of the automated proof. Normally, GeoGebra decides whether a xref:/Boolean_values.ado... e.g. Let us define a triangle with vertices _A_, _B_ and _C_, and define D=MidPoint(B
- **Radius( <Conic> )** | Returns the radius of a conic. e.g. * Returns the radius of a circle c (e.g. c:(x - 1)² + (y - 1)² = 9) Radius(c) yi
- **Ray( <Start Point>, <Point>  | Ray)** | Creates a ray starting at a point through a point.
- **RigidPolygon( <Polygon>  | RigidPolygon)** | Creates a copy of any polygon that can only be translated by dragging its first vertex and rotated by dragging its secon...
- **Sector( <Conic>, <Point>, <Point>  | Sector)** | Yields a conic sector between two points on the conic section and calculates its area. e.g. * Let c: x^2 + 2y^2 = 8 be an ellipse, D = (-2.83, 0) and E = (0, -2) two points
- **Segment( <Point>, <Point>  | Segment)** | Creates a segment between two points.
- **Semicircle( <Point>, <Point> )** | Creates a semicircle above the segment between the two points and displays its length in _Algebra View_.
- **Slope( <Line> )** | Returns the slope of the given line.
- **Tangent( <Point>, <Conic>  | Tangent)** | Creates (all) tangents through the point to the conic section. e.g. Tangent((5, 4), 4x^2 - 5y^2 = 20) yields _x - y = 1_.
- **TriangleCenter( <Point>, <Point>, <Point>, <Number> )** | gives _n_-th https://en.wikipedia.org/wiki/Triangle_center[triangle center] of triangle _ABC_. Works for _n < 3054_. == ... e.g. Let _A = (1, -2)_, _B = (6, 1)_ and _C = (4, 3)_. TriangleCenter(A, B, C, 2) yie
- **TriangleCurve( <Point P>, <Point Q>, <Point R>, <Equation in A, B, C> )** | Creates implicit polynomial, whose equation in https://en.wikipedia.org/wiki/Barycentric_coordinate_system_(mathematics)... e.g. If _P_, _Q_, _R_ are points, TriangleCurve(P, Q, R, (A - B)*(B - C)*(C - A) = 0)
- **Trilinear( <Point>, <Point>, <Point>, <Number>, <Number>, <Number> )** | creates a point whose https://en.wikipedia.org/wiki/Trilinear_coordinates[trilinear coordinates] are the given numbers w...
- **Type( <Object> )** | For conics and quadrics this command returns a number representing the conic/quadric type according to the table below. ... e.g. Type(x²+y²=1) yields 4 which stands for circle.
- **Vertex( <Conic>  | Vertex)** | Returns (all) vertices of the conic section. e.g. * Vertex((x + y < 3) && (x - y > 1)) returns point _A = (2, 1)_. * {Vertex((x + 

## List Commands

- **Append( <List>, <Object>  | Append)** | Appends the object to the list and yields the results in a new list. e.g. Append({1, 2, 3}, 4) creates the list _{1, 2, 3, 4}_.
- **DataFunction( <List of Numbers>, <List of Numbers> )** | Yields a function that connects points (x~1~, y~1~), (x~2~, y~2~),...,(x~n~, y~n~) where {x~1~, ..., x~n~}, {y~1~, ..., ... e.g. * DataFunction({0, 1, 2, 4}, {0, 1, 4, 16}) yields a function that goes through 
- **Flatten( <List> )** | Flattens lists to one list. e.g. Flatten({2, 3, {5, 1}, {{2, 1, {3}}}}) yields _list1 = {2, 3, 5, 1, 2, 1, 3}_.
- **Insert( <Object>, <List>, <Position>  | Insert)** | Inserts the object in the list at the given position. e.g. Insert(x^2, {1, 2, 3, 4, 5}, 3) places _x^2^_ at the third position and creates 
- **Intersection( <List>, <List> )** | Gives you a new list containing all elements that are part of both lists. e.g. Let list1 = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15} and list2 = {2, 
- **Join( <List>, <List>, ...  | Join)** | Joins the two (or more) lists. e.g. Join({5, 4, 3}, {1, 2, 3}) creates the list _{5, 4, 3, 1, 2, 3}_.
- **OrdinalRank( <List> )** | Returns a list, whose _i_-th element is the rank of _i_-th element of list _L_ (rank of element is its position in xref:... e.g. * OrdinalRank({4, 1, 2, 3, 4, 2}) returns _{5, 1, 2, 4, 6, 3}_ * OrdinalRank({3,
- **PointList( <List> )** | Creates list of points from a list of two-element lists. e.g. PointList({{1,2},{3,4}}) returns {(1,2),(3,4)}.
- **RandomElement( <List> )** | Returns randomly chosen element from the xref:/Lists.adoc[list] (with uniform probability). All elements in the list mus... e.g. RandomElement({3, 2, -4, 7}) yields one of _{-4, 2, 3, 7}_.
- **Remove( <List>, <List> )** | Removes objects from the first list each time they appear in the second list. e.g. Remove({1,3,4,4,9},{1,4,5}) yields list {3,4,9}.
- **RemoveUndefined( <List> )** | Removes undefined objects from a list. e.g. RemoveUndefined(Sequence((-1)^k, k, -3, -1, 0.5)) removes the second and fourth 
- **Reverse( <List>  | Reverse)** | Reverses the order of a xref:/Lists.adoc[list]. == CAS Syntax e.g. Reverse(list1) reverses list1 = {(1, 2), (3, 4), (5, 6)} to create _list2 = {(5,
- **RootList( <List> )** | Converts a given list of numbers {a~1~,a~2~,...,a~n~} to a list of points {(a~1~,0),(a~2~,0),...,(a~n~,0)}, which is als... e.g. Command RootList({3, 4, 5, 2, 1, 3}) returns the list of points _list1={(3,0), (
- **SelectedElement( <List> )** | Returns the selected element in a xref:/Action_Objects.adoc[drop-down list].
- **SelectedIndex( <List> )** | Returns the index of the selected element of a xref:/Action_Objects.adoc[drop-down list].
- **Sequence( <End Value >  | Sequence)** | Creates a list of integers from 1 to the given end value. e.g. * Sequence(4) creates the list _{1, 2, 3, 4}_. * 2^Sequence(4) creates the list 
- **Sort( <List>  | Sort)** | Sorts a list of numbers, text objects, or points. e.g. * Sort({3, 2, 1}) gives you the list _{1, 2, 3}_. * Sort({"pears", "apples", "fi
- **TiedRank( <List> )** | Returns a list, whose _i_-th element is the rank of _i_-th element of the given list _L_ (rank of element is its positio... e.g. * TiedRank({4, 1, 2, 3, 4, 2}) returns {5.5, 1, 2.5, 4, 5.5, 2.5}. * TiedRank({3
- **Union( <List>, <List>  | Union)** | Joins the two lists and removes elements that appear multiple times. e.g. Union( {1, 2, 3, 4, 5}, {3, 2, 1, 7} ) yields {1, 2, 3, 4, 5, 7}.
- **Unique( <List>  | Unique)** | Returns list of elements of the given list in ascending order, repetitive elements are included only once. Works for bot... e.g. * Unique({1, 2, 4, 1, 4}) yields _{1, 2, 4}_. * Unique({"a", "b", "Hello", "Hell
- **Zip( <Expression>, <Var1>, <List1>, <Var2>, <List2>, ...)** | Creates xref:/Lists.adoc[list] of objects obtained by substitution of variables in the expression by elements of corresp... e.g. Let P, Q, R, S be some points. Zip(Midpoint(A, B), A, {P, Q}, B, {R, S}) returns

## Vector & Matrix Commands

- **ApplyMatrix( <xref:/Matrices.adoc[Matrix]>, <xref:/Geometric_Objects.adoc[Object]> )** | Transforms the object _O_ so that point _P_ of _O_ is mapped to: * point _M*P_, if _P_ is a _2D_ point and _M_ is a 2 x ... e.g. Let M={{cos(π/2),-sin(π/2)}, {sin(π/2), cos(π/2)}} be the transformation matrix 
- **CharacteristicPolynomial( <Matrix> )** | Returns the https://en.wikipedia.org/wiki/Characteristic_polynomial[characteristic polynomial] of the given matrix. e.g. CharacteristicPolynomial({{1,2},{3,4}}) yields stem:[x^2-5x-2].
- **Cross( <Vector u> , <Vector v> )** | Calculates the https://en.wikipedia.org/wiki/Cross_product[cross product] of _u_ and _v_. Instead of vectors you can als... e.g. * Cross((1, 3, 2), (0, 3, -2)) yields _(-12, 2, 3)_ * Cross({1, 1, 1}, {-1, -1, 
- **CurvatureVector( <Point>, <Object> )** | Yields the curvature vector of the object (function, curve, conic) in the given point. e.g. * CurvatureVector((0, 0), x^2) yields vector _(0, 2)_ * CurvatureVector((0, 0), 
- **Determinant( <Matrix>  | Determinant)** | Gives the determinant of the matrix. == CAS Syntax e.g. Determinant({{1, 2}, {3, 4}}) yields _a = -2_.
- **Dimension( <Object>  | Dimension)** | Gives the dimension of a vector or a matrix. == CAS Syntax e.g. Dimension({1, 2, 0, -4, 3}) yields _5_. Dimension({{1, 2}, {3, 4}, {5, 6}}) yiel
- **Direction( <Line> )** | Yields the direction vector of the line. e.g. Direction(-2x + 3y + 1 = 0) yields the vector stem:[u= \begin{pmatrix} 3 \\ 2 \e
- **Dot( <Vector>, <Vector> )** | Returns the dot product (scalar product) of the two vectors. e.g. Dot((1, 3, 2), (0, 3, -2)) yields _5_, the scalar product of _(1, 3, 2)_ and _(0
- **Eigenvalues( <Matrix> )** | Finds the eigenvalues of the given matrix. e.g. Eigenvalues({{1, 2}, {3, 4}}) yields stem:[ \left\{ \frac{\sqrt{33} + 5}{2}, \fr
- **Eigenvectors( <Matrix> )** | Finds the eigenvectors of the given matrix. e.g. Eigenvectors({{1, 2}, {3, 4}}) yields stem:[ \left(\begin{array}{}\sqrt{33} - 3&
- **Element( <List>, <Position of Element n>  | Element)** | Yields the __n__^th^ element of the list. e.g. Element({1, 3, 2}, 2) yields _3_, the second element of _{1, 3, 2}_.
- **Identity( <Number> )** | Gives the identity matrix of the given order. e.g. Identity(3) yields the matrix _stem:[\begin{pmatrix}1&0&0\\0&1&0\\0&0&1\end{pmat
- **Invert( <Matrix>  | Invert)** | Inverts the given matrix. e.g. Invert({{1, 2}, {3, 4}}) yields stem:[\begin{pmatrix}-2 & 1\\1.5 & -0.5\end{pmat
- **JordanDiagonalization( <Matrix> )** | Decomposes the given matrix into the form S J S⁻¹ where J is in https://mathworld.wolfram.com/JordanCanonicalForm.html[J... e.g. JordanDiagonalization({{1, 2}, {3, 4}}) yields stem:[ \left(\begin{array}{}\sqrt
- **LUDecomposition( <Matrix> )** | Calculates the https://en.wikipedia.org/wiki/LU_decomposition[LU decomposition] of the given matrix. e.g. LUDecomposition({{2,0},{1,1}}) returns the matrices stem:[\begin{pmatrix}0&1\\1&
- **Length( <Object>  | Length)** | Yields the length of the object. e.g. * Length( <Vector> ) yields the length of the vector. * Length( <Point> ) yields
- **MatrixRank( <Matrix> )** | Returns the https://en.wikipedia.org/wiki/Rank_(linear_algebra)[rank] of given matrix. e.g. * MatrixRank({{2, 2}, {1, 1}}) yields _1_. * MatrixRank({{1, 2}, {3, 4}}) yields
- **MinimalPolynomial( <Matrix> )** | Returns the https://en.wikipedia.org/wiki/Minimal_polynomial_(linear_algebra)[minimal polynomial] of the given matrix. e.g. MinimalPolynomial({{1,0},{0,1}}) yields stem:[x-1].
- **PerpendicularVector( <Line>  | PerpendicularVector)** | Returns one of the perpendicular vector to the line. e.g. Let Line((1, 4), (5, -3)) be the line _j_. PerpendicularVector(j) yields vector 
- **QRDecomposition( <Matrix> )** | Calculates the https://en.wikipedia.org/wiki/QR_decomposition[QR decomposition] of the given matrix. e.g. QRDecomposition({{1,2},{3,4}}) returns the matrices stem:[\begin{pmatrix}\frac{1
- **ReducedRowEchelonForm( <Matrix>  | ReducedRowEchelonForm)** | Returns the https://en.wikipedia.org/wiki/Row_echelon_form[reduced echelon form] of the matrix. == CAS Syntax e.g. * ReducedRowEchelonForm({{1, 6, 4}, {2, 8, 9}, {4, 5, 6}}) yields the matrix ste
- **SVD( <Matrix> )** | Returns the https://en.wikipedia.org/wiki/Singular_value_decomposition[Singular Value Decomposition] of the matrix (as a... e.g. SVD({{3, 1, 1}, {-1, 3, 1}}) yields a list containing stem:[ \left(\begin{array}
- **ToComplex( <Vector>  | ToComplex)** | Transforms a vector or point to a complex number in algebraic form. == CAS Syntax e.g. ToComplex((3, 2)) yields _3 + 2ί_.
- **ToPolar( <Vector>  | ToPolar)** | Transforms a vector into its polar coordinates. e.g. ToPolar({1, sqrt(3)}) yields _(2; 60°)_ in the view algebra.svg,width=16,height=
- **Transpose( <Matrix>  | Transpose)** | Transposes the matrix. == CAS Syntax e.g. Transpose({{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}) yields the matrix stem:[\begin{pmat
- **UnitPerpendicularVector( <Line> | UnitPerpendicularVector)** | Returns the perpendicular vector with length 1 of the given line. e.g. UnitPerpendicularVector(3x + 4y = 5) yields _stem:[\begin{pmatrix}0.6\\0.8\end{p
- **UnitVector( <Vector>  | UnitVector)** | Yields a vector with length 1, which has the same direction and orientation as the given vector. The vector must be defi... e.g. Let _v=stem:[\begin{pmatrix}3\\4\end{pmatrix}]_. UnitVector(v) yields _stem:[\be
- **Vector( <Point>  | Vector)** | Returns the position vector of the given point. e.g. Vector((3, 2)) yields _u = stem:[\begin{pmatrix}3\\2\end{pmatrix}]_.

## CAS Specific Commands

- **Assume( <Condition>, <Expression> )** | Evaluates the expression according to the condition e.g. * Assume(a > 0, Integral(exp(-a x), 0, infinity)) yields 1 / a. * Assume(x>0 && 
- **CFactor( <Expression>  | CFactor)** | Factorizes a given expression, allowing for complex factors. e.g. CFactor(x^2 + 4) yields _(x + 2 ί) (x - 2 ί)_, the factorization of _x^2^ + 4_.
- **CIFactor( <Expression>  | CIFactor)** | Factors over the complex irrationals. e.g. CIFactor(x^2 + x + 1) returns stem:[ \left( x + \frac{-ί \sqrt{3} + 1}{2} \right
- **CSolutions( <Equation>  | CSolutions)** | Solves a given equation for the main variable and returns a list of all solutions, allowing for complex solutions. e.g. CSolutions(x^2 = -1) yields _{ί, -ί}_, the complex solutions of _x^2^ = -1_.
- **CSolve( <Equation>  | CSolve)** | Solves a given equation for the main variable and returns a list of all solutions, allowing for complex solutions. e.g. CSolve(x^2 = -1) yields _{x = ί, x = -ί}_, the complex solutions of _x^2^ = -1_.
- **CommonDenominator( <Expression>, <Expression>  | CommonDenominator)** | Returns the function having as equation the lowest common denominator of the two expressions. == CAS Syntax e.g. CommonDenominator(3 / (2 x + 1), 3 / (4 x^2 + 4 x + 1)) yields _f_(_x_) = 4 __x_
- **CompleteSquare( <Quadratic Function>  | CompleteSquare)** | Returns the quadratic function in the form: stem:[a (x - h)^2 + k]. == CAS Syntax e.g. CompleteSquare(x^2 - 4x + 7) yields _1 (x - 2)^2^ + 3_.
- **Delete( <Object>  | Delete)** | Deletes the object and all its dependent objects. == CAS Syntax e.g. Let _P_ be a point, _sli_ a slider, and _seg=Segment(P, sli)_. The command Delet
- **Div( <Dividend Number>, <Divisor Number>  | Div)** | Returns the quotient (integer part of the result) of the two numbers. e.g. Div(16, 3) yields _5_.
- **Division( <Dividend Number>, <Divisor Number>  | Division)** | Gives the quotient (integer part of the result) and the remainder of the division of the two numbers. e.g. Division(16, 3) yields _{5, 1}_.
- **Divisors( <Number>  | Divisors)** | Calculates the number of all the positive divisors, including the number itself. == CAS Syntax e.g. Divisors(15) yields _4_, the number of all positive divisors of _15_, including 
- **DivisorsList( <Number>  | DivisorsList)** | Gives the list of all the positive divisors, including the number itself. == CAS Syntax e.g. DivisorsList(15) yields _{1, 3, 5, 15}_, the list of all positive divisors of _1
- **DivisorsSum( <Number>  | DivisorsSum)** | Calculates the sum of all the positive divisors, including the number itself. == CAS Syntax e.g. DivisorsSum(15) yields _24_, the sum _1 + 3 + 5 + 15_.
- **Eliminate( <List of Polynomials>, <List of Variables> )** | Considers the algebraic equation system defined by the polynomials, and computes an equivalent system after eliminating ... e.g. Eliminate({x^2 + x, y^2 - x}, {x}) yields {stem:[ y^{4} + y^{2} ]}.
- **Expand( <Expression>  | Expand)** | Expands the expression. == CAS Syntax e.g. Expand((2 x - 1)^2 + 2 x + 3) yields stem:[4 x^2 - 2 x + 4].
- **ExtendedGCD( <Integer>,<Integer>  | ExtendedGCD)** | Returns a list containing the integer coefficients stem:[s, t] of Bézout's identity stem:[as+bt= GCD(a,b)] and the great... e.g. ExtendedGCD(240,46) yields {stem:[-9,47,2]}. (Plugging the result into the Bézou
- **GCD( <Number>, <Number>  | GCD)** | Calculates the greatest common divisor of the two numbers . e.g. GCD(12, 15) yields _3_.
- **GroebnerDegRevLex( <List of Polynomials>  | GroebnerDegRevLex)** | Computes the Gröbner basis of the list of the polynomials with respect to graded reverse lexicographical ordering of the... e.g. GroebnerDegRevLex({x^3 - y - 2, x^2 + y + 1}) yields {stem:[ y^{2} - x + 3 y + 3
- **GroebnerLex( <List of Polynomials>  | GroebnerLex)** | Computes the Gröbner basis of the list of the polynomials with respect to lexicographical ordering of the variables (als... e.g. GroebnerLex({x^3-y-2,x^2+y+1}) yields {stem:[ y^{3} + 4 y^{2} + 7 y + 5, x - y^{
- **GroebnerLexDeg( <List of Polynomials>  | GroebnerLexDeg)** | Computes the Gröbner basis of the list of the polynomials with respect to graded lexicographical ordering of the variabl... e.g. GroebnerLexDeg({x^3 - y - 2, x^2 + y + 1}) yields {stem:[ -y^{2} + x - 3 y - 3, 
- **IFactor( <Polynomial>  | IFactor)** | Factors over the irrationals. == CAS Syntax e.g. IFactor(x^2 + x - 1) gives stem:[ \left( x + \frac{-\sqrt{5} + 1}{2} \right) \le
- **LCM( <Number>, <Number>  | LCM)** | Calculates the least common multiple of two numbers. e.g. LCM(12, 15) yields _60_.
- **LeftSide( <Equation>  | LeftSide)** | Gives the left-hand side of the simplified equation. == CAS Syntax e.g. LeftSide(4x = 1 - 3y) yields _4x_.
- **MixedNumber( <Number> )** | Converts the given number to a mixed number. e.g. * MixedNumber(3.5) yields stem:[3 + \frac{1}{2}]. * MixedNumber(12 / 3) yields _
- **Mod( <Dividend Number>, <Divisor Number>  | Mod)** | Yields the remainder when dividend number is divided by divisor number. e.g. Mod(9, 4) yields _1_.
- **ModularExponent( <Number>, <Number>, <Number> )** | Returns the modular exponent of the given numbers. See also https://en.wikipedia.org/wiki/Modular_exponentiation[Modular... e.g. ModularExponent(5,12,13) yields stem:[1], since stem:[mod(5^{12},13)=1].
- **NSolutions( <Equation>  | NSolutions)** | Attempts (numerically) to find a solution for the equation for the main variable. For non-polynomials you should always ... e.g. NSolutions(x^6 - 2x + 1 = 0) yields _{0.51, 1}_ or _{0.508660391642, 1}_ (the nu
- **NSolve( <Equation>  | NSolve)** | Attempts (numerically) to find a solution for the equation for the main variable. For non-polynomials you should always ... e.g. NSolve(x^6 - 2x + 1 = 0) yields _{x = 0.51, x = 1}_.
- **NextPrime( <Number> )** | Returns the smallest prime greater than the entered number. e.g. NextPrime(10000) yields _10007_.
- **Numeric( <Expression>  | Numeric)** | Tries to determine a numerical approximation of the given expression. The number of decimals depends on the global round... e.g. Numeric(3 / 2) yields _1.5_.
- **PreviousPrime( <Number> )** | Returns the greatest prime smaller than the entered number. e.g. PreviousPrime(10000) yields _9973_.
- **PrimeFactors( <Number>  | PrimeFactors)** | Returns the list of https://en.wikipedia.org/wiki/Prime_number[primes] whose product is equal to the given number. == CA... e.g. * PrimeFactors(1024) yields _{2, 2, 2, 2, 2, 2, 2, 2, 2, 2}_. * PrimeFactors(42)
- **Rationalize( <Number> )** | Creates the fraction of the given _Number_, and rationalizes the denominator, if it contains square roots. e.g. * Rationalize(3.5) yields stem:[\frac{7}{2}]. * Rationalize(1/sqrt(2)) yields st
- **RightSide( <Equation>  | RightSide)** | Gives the right-hand side of the simplified equation. == CAS Syntax e.g. RightSide(x + 2 = 3x + 1) yields _0.5_
- **Solutions( <Equation>  | Solutions)** | Solves a given equation for the main variable and returns a list of all solutions. == CAS Syntax e.g. Solutions(x^2 = 4x) yields _{0, 4}_.
- **Solve( <Equation in x>  | Solve)** | Solves a given equation for the main variable and returns a list of all solutions. == CAS Syntax The following commands ... e.g. Solve(x^2 = 4x) yields _{x = 4, x = 0}_, the solutions of _x^2^ = 4x_.
- **SolveCubic( <Cubic Polynomial> )** | Solves a given https://en.wikipedia.org/wiki/Cubic_function[cubic polynomial] and returns a list of all solutions. e.g. SolveCubic(x³ - 1) yields { 1, stem:[ \frac{1}{2} (\sqrt{3} i -1) ] , stem:[ \fr
- **SolveQuartic( <Quartic Polynomial> )** | Solves a given https://en.wikipedia.org/wiki/Quartic_function[quartic polynomial] and returns a list of all solutions. e.g. SolveQuartic( x^4 + x^3 + x^2 + x ) yields {0, -1, _i_, -_i_ }
- **Substitute( <Expression>, <from>, <to>  | Substitute)** | Replaces in _expression_ all occurrences of _from_ with _to_ and evaluates the result when variables are substituted wit... e.g. * Substitute((3 m - 3)^2 - (m + 3)^2, m, a) yields _8 a^2^ - 24 a_. * Substitute

## Function & Calculus Commands

- **Asymptote( <Conic>  | Asymptote)** | Yields both asymptotes of the conic. e.g. Asymptote(x^2 - y^2 /4 = 1) returns line _-2x + y = 0_ and line _-2x - y = 0_.
- **Coefficients( <Polynomial>  | Coefficients)** | Yields the list of all coefficients stem:[a_k,a_{k-1},\ldots,a_1, a_0] of the polynomial stem:[a_k x^k+a_{k-1}x^{k-1}+\c... e.g. Coefficients(x^3 - 3 x^2 + 3 x) yields _{1, -3, 3, 0}_.
- **ComplexRoot( <Polynomial>  | ComplexRoot)** | Finds the complex roots of a given polynomial in _x_. Points are created in image:16px-Menu_view_graphics.svg.png[Menu v... e.g. ComplexRoot(x^2 + 4) yields _(0 + 2 ί)_ and _(0 - 2 ί)_
- **Curvature( <Point>, <Object> )** | Yields the curvature of the object (function, curve, conic) at the given point. e.g. * Curvature((0 ,0), x^2) yields _2_ * Curvature((0, 0), Curve(cos(t), sin(2t), t
- **Curve( <Expression>, <Expression>, <Parameter Variable>, <Start Value>, <End Value>  | Curve)** | Yields the Cartesian xref:/Curves.adoc[parametric curve] for the given _x_-expression (first <Expression>) and _y_-expre... e.g. Curve(2 cos(t), 2 sin(t), t, 0, 2π) creates a circle with radius _2_ around the 
- **Degree( <Polynomial>  | Degree)** | Gives the https://en.wikipedia.org/wiki/degree_of_a_polynomial[degree of a polynomial] (in the main variable). == CAS Sy... e.g. Degree(x^4 + 2 x^2) yields _4_
- **Denominator( <Function>  | Denominator)** | Returns the denominator of a function. e.g. Denominator(5 / (x^2 + 2)) yields _f(x)=(x^2^ + 2)_.
- **Derivative( <Function>  | Derivative)** | Returns the derivative of the function with respect to the main variable. e.g. Derivative(x^3 + x^2 + x) yields _3x² + 2x + 1_.
- **Extremum( <Polynomial>  | Extremum)** | Yields all local extrema of the polynomial function as points on the function graph. e.g. Extremum(x³ + 3x² - 2x + 1) creates local extrema _(0.29, 0.70)_ and _(-2.29, 9.
- **Factor( <Polynomial>  | Factor)** | Factors the polynomial. == CAS Syntax In the image:16px-Menu_view_cas.svg.png[Menu view cas.svg,width=16,height=16] xref... e.g. Factor(x^2 + x - 6) yields _(x - 2) (x + 3)_.
- **Factors( <Polynomial>  | Factors)** | Gives a list of lists of the type _{factor, exponent}_ such that the product of all these factors raised to the power of... e.g. Factors(x^8 - 1) yields _{{x - 1, 1}, {x + 1, 1}, {x^2 + 1, 1}, {x^4 + 1, 1}}_.
- **Function( <List of Numbers>  | Function)** | Yields the following function: The first two numbers determine the start _x_-value and the end _x_-value. The rest of th... e.g. * Function[{2, 4, 0, 1, 0, 1, 0}] yields a triangular wave between _x = 2_ and _
- **ImplicitCurve( <List of Points>  | ImplicitCurve)** | Creates xref:/Curves.adoc[implicit curve] through given set of points. The length of the list must be stem:[\frac{n(n+3)...
- **ImplicitDerivative( <f)** | Gives the https://en.wikipedia.org/wiki/Implicit_derivative[implicit derivative] of the given expression. == CAS Syntax e.g. ImplicitDerivative(x + 2 y) yields _-0.5_.
- **InflectionPoint( <Polynomial>  | InflectionPoint)** | Yields all inflection points of the polynomial as points on the function graph. == CAS Syntax e.g. InflectionPoint[x^3] yields _(0, 0)_.
- **Integral( <Function>  | Integral)** | Gives the indefinite integral with respect to the main variable. e.g. Integral(x³) gives _stem:[\frac{1}{4}x^4]_ .
- **IntegralBetween( <Function>, <Function>, <Number>, <Number>  | IntegralBetween)** | Gives the definite integral of the difference _f(x) ‐ g(x)_ of two function _f_ and _g_ over the interval _[a, b]_, wher... e.g. IntegralBetween(sin(x), cos(x), 0, pi) yields 2.
- **IntegralSymbolic(<Function> | IntegralSymbolic)** | Gives the indefinite symbolic integral with respect to the main variable. The constant of integration _c_ is not shown a... e.g. IntegralSymbolic(3x^2) yields stem:[x^3+c_{1}].
- **InverseLaplace( <Function>  | InverseLaplace)** | Returns the https://en.wikipedia.org/wiki/Inverse_Laplace_transform[inverse Laplace transform] of the given function. e.g. InverseLaplace(1/(1+t^2)) returns stem:[\mathbf{ sin(t)} ].
- **Iteration( <Function>, <Start Value>, <Number of Iterations>  | Iteration)** | Iterates the function _n_ times (_n_ = number of iterations) using the given start value. e.g. * After defining f(x) = x^2 the command Iteration(f, 3, 2) gives you the result 
- **IterationList( <Function>, <Start Value>, <Number of Iterations>  | IterationList)** | Gives you a list of length _n+1_ (_n_ = number of iterations) whose elements are iterations of the function starting wit... e.g. After defining f(x) = x^2 the command IterationList(f, 3, 2) gives you the list 
- **Laplace( <Function>  | Laplace)** | Returns the https://en.wikipedia.org/wiki/Laplace_transform[Laplace transform] of the given function e.g. Laplace(sin(t)) returns stem:[\mathbf{\frac{1}{s^{2} + 1}} ]
- **LeftSum( <Function>, <Start x-Value>, <End x-Value>, <Number of Rectangles> )** | Calculates the left sum of the function in the interval using _n_ rectangles. e.g. LeftSum(x^2 + 1, 0, 2, 4) yields _a_ = 3.75
- **Limit( <Function>, <Value>  | Limit)** | Computes the https://en.wikipedia.org/wiki/Limit_of_a_function[limit] of the function for the given value of the main fu... e.g. Limit((x^2 + x) / x^2, +∞) yields _1_.
- **LimitAbove( <Function>, <Value>  | LimitAbove)** | Computes the right https://en.wikipedia.org/wiki/Limit_of_a_function#One-sided_limits[one-sided limit] of the function f... e.g. LimitAbove(1 / x, 0) yields _stem:[\infty]_ .
- **LimitBelow( <Function>, <Value>  | LimitBelow)** | Computes the left https://en.wikipedia.org/wiki/Limit_of_a_function#One-sided_limits[one-sided limit] of the function fo... e.g. LimitBelow(1 / x, 0) yields stem:[-\infty] .
- **LowerSum( <Function>, <Start x-Value>, <End x-Value>, <Number of Rectangles> )** | Calculates the _lower sum_ of the given function on the interval [_Start x-Value, End x-Value_], using _n_ rectangles. e.g. LowerSum(x^2, -2, 4, 6) yields _15_.
- **NDerivative( <Function>  | NDerivative)** | Plots the 1st derivative of the given function, calculated numerically. e.g. NDerivative(x^4+2x^3-2x+1) plots in _Graphics View_ the graph of the function f(
- **NIntegral( <Function>  | NIntegral)** | Plots the graph of the indefinite integral stem:[y=F(x)+c] of the given function, with constant of integration _c_ = 0. ... e.g. NIntegral(ℯ^(-x^2), 0, 1) yields _0.75_.
- **NInvert( <Function> )** | Gives the inverse of the function without showing the inverted formula. If you want to get the formula, use the xref:./I... e.g. NInvert(sin(x)) yields a function _f_ such that _sin(f(x))=x_ for _-1 < x < 1_.
- **NSolveODE( <List of Derivatives>, <Initial x-coordinate>, <List of Initial y-coordinates>, <Final x-coordinate> )** | Solves (numerically) the system of differential equations e.g. f'(t, f, g, h) = g g'(t, f, g, h) = h h'(t, f, g, h) = -t h + 3t g + 2f + t NSol
- **Numerator( <Function>  | Numerator)** | Returns the numerator of the function. e.g. Numerator((3x² + 1) / (2x - 1)) yields _f(x) = 3x² + 1_.
- **OsculatingCircle( <Point>, <Function>  | OsculatingCircle)** | Yields the osculating circle of the function in the given point. e.g. OsculatingCircle((0, 0), x^2) yields _x² + y² - y = 0_.
- **ParametricDerivative( <Curve> )** | Returns a new xref:/Curves.adoc[parametric curve] given by _stem:[ \left( x(t), \frac{y'(t)}{ x'(t)} \right) ]_. e.g. ParametricDerivative(Curve(2t, t², t, 0, 10)) returns the parametric curve _(x(t
- **PartialFractions( <Function>  | PartialFractions)** | Yields, if possible, the https://en.wikipedia.org/wiki/Partial_fraction[partial fraction] of the given function for the ... e.g. PartialFractions(x^2 / (x^2 - 2x + 1)) yields _1 + stem:[\frac{1}{(x - 1)²}] + s
- **PlotSolve( <Equation in x> )** | Solves a given equation for the main variable and returns a list of all solutions and the graphical output in the Graphi... e.g. PlotSolve(x^2 = 4x) yields _{(0, 0), (4, 0)}_ and displays the points _(0, 0)_ a
- **Polynomial( <Function>  | Polynomial)** | Expands the expression of a polynomial function and simplifies the result. e.g. Polynomial((x - 3)^2) yields _x^2^ - 6x + 9_.
- **RectangleSum( <Function>, <Start x-Value>, <End x-Value>, <Number of Rectangles>, <Position for rectangle start> )** | Calculates between the _Start x-Value_ and the _End x-Value_ the sum of rectangles with left height starting at a fracti...
- **RemovableDiscontinuity( <Function> )** | Computes the removable discontinuity at a point for broken rational functions (also for previews). e.g. RemovableDiscontinuity((3-x)/(2 x^(2)-6 x)) yields _(3,-0.17)_.
- **Root( <Polynomial>  | Root)** | Yields all roots of the polynomial as intersection points of the function graph and the _x_‐axis. e.g. Root(0.1*x^2 - 1.5*x + 5) yields _A = (5, 0)_ and _B = (10, 0)_.
- **Roots( <Function>, <Start x-Value>, <End x-Value> )** | Calculates the roots for function in the given interval. The function must be continuous on that interval. Because this ... e.g. Roots(f, -2, 1) with the function f(x) = 3x³ + 3x² - x yields A = (-1.264, 0), B
- **SlopeField( <f)** | Plots a https://en.wikipedia.org/wiki/Slope_field[slope field] of the differential equation stem:[\frac{dy}{dx}=f(x,y)] e.g. SlopeField(x+y) plots the slope field of the differential equation stem:[\frac{d
- **SolveODE( <f')** | Attempts to find the exact solution of the first order ordinary differential equation (ODE) stem:[\frac{dy}{dx}(x)=f'(x,... e.g. SolveODE(2x / y) yields _stem:[\sqrt{2} \sqrt{-c_{1}+x^{2}}]_, where stem:[c_{1}
- **Spline( <List of Points>  | Spline)** | Creates a cubic https://en.wikipedia.org/wiki/Spline_(mathematics)[spline] through all points.
- **TaylorPolynomial( <Function>, <x-Value>, <Order Number>  | TaylorPolynomial)** | Creates the Taylor series expansion of the given function at the point _x-Value_ up to the given order. == CAS Syntax e.g. TaylorPolynomial(x^2, 3, 1) gives _9 + 6 (x - 3)_, the Taylor series expansion o
- **ToExponential( <Complex Number> )** | Transforms a complex number into its exponential form. e.g. ToExponential(1 + ί) yields stem:[\sqrt{2}e^{\frac{i\pi}{4}}].
- **ToPoint( <Complex Number> )** | Creates a point from the complex number. e.g. ToPoint(3 + 2ί) creates a point with coordinates _(3, 2)_.
- **TrapezoidalSum( <Function>, <Start x-Value>, <End x-Value>, <Number of Trapezoids> )** | Calculates the trapezoidal sum of the function in the interval [_Start x-Value, End x-Value_] using _n_ trapezoids. e.g. TrapezoidalSum(x^2, -2, 3, 5) yields _12.5_.
- **TrigCombine( <Expression>  | TrigCombine)** | Combines products of trigonometric terms into sums, or combines sums of trigonometric terms into an expression containin... e.g. * TrigCombine(sin(x) cos(3x)) gives stem:[\frac{1}{2} \sin \left( 4 x \right) - 
- **TrigExpand( <Expression>  | TrigExpand)** | Expands trigonometric functions of a sum of variables into trigonometric functions of a single variable, or expands prod... e.g. TrigExpand(tan(x + y)) gives stem:[\frac{\frac{\sin(x)}{\cos(x)}+\frac{\sin(y)}{
- **TrigSimplify( <Expression>  | TrigSimplify)** | Simplifies the given trigonometric expression. == CAS Syntax e.g. * TrigSimplify(1 - sin(x)^2) gives _cos²(x)_. * TrigSimplify(sin(x)^2 - cos(x)^2
- **UpperSum( <Function>, <Start x-Value>, <End x-Value>, <Number of Rectangles> )** | Calculates the _upper sum_ of the function on the interval [_Start x-Value, End x-Value_] using _n_ rectangles. e.g. UpperSum(x^2, -2, 4, 6) yields _35_.

## Uncategorized

- **AttachCopyToView( <Object>, <View 0|1|2>  | AttachCopyToView)** | If _View = 0_, a copy of given object is created. For _View = 1_ or _View = 2_ this command creates a dependent copy of ... e.g. Let poly = Polygon((0, 0), (1, 0), (1, 1), (0, 1)). If Graphics View 1 is active
- **Button(  | Button)** | Creates a new xref:/Action_Objects.adoc[button]. e.g. Button("Ok") creates a button in the left upper corner of the view graphics.svg,
- **CenterView( <Center Point> )** | Translates the image:16px-Menu_view_graphics.svg.png[Menu view graphics.svg,width=16,height=16] xref:/Graphics_View.adoc... e.g. CenterView((0, 0)) moves the origin to the center of the _Graphics View_.
- **Checkbox(  | Checkbox)** | Creates a xref:/Action_Objects.adoc[checkbox]. e.g. Let _A_ and _B_ be points. c = Checkbox({A,B}) creates checkbox _c_. When _c_ is
- **CopyFreeObject( <Object> )** | Creates a xref:/Free_Dependent_and_Auxiliary_Objects.adoc[free] copy of the object. Preserves all basic xref:/Object_Pro...
- **Execute( <List of Texts>  | Execute)** | Executes a list of commands entered as texts. e.g. * Execute({"A=(1,1)","B=(3,3)","C = Midpoint(A, B)"}) creates points _A, B_ and 
- **ExportImage( <Property>, <Value>, <Property>, <Value>, ... )** | Exports an image of the currently active view (or the view specified by the "view" parameter) e.g. * ExportImage("scale", 5) Shows a popup of the current view so that the user can
- **GetTime( | GetTime)** | Returns a list with the current time and date in this order: milliseconds, seconds, minutes, hours (0-23), date, month (... e.g. GetTime() returns a list such as _{647, 59, 39, 23, 28, 2, 2011, "February", "Mo
- **HideLayer( <Number> )** | Makes all objects in given xref:/Layers.adoc[layer] xref:/Object_Properties.adoc[invisible]. Does not override xref:/Con...
- **InputBox( <Linked Object> )** | Create a new xref:/Action_Objects.adoc[Input Box] and associate a Linked Object with it.
- **Pan( <x>, <y>  | Pan)** | Shifts the active view by _x_ pixels to the right and _y_ pixels upwards.
- **PlaySound( <URL>  | PlaySound)** | Plays an MP3 (.mp3) file e.g. * PlaySound("https://github.com/murkle/utils/raw/refs/heads/master/welcome-to-ge
- **Rename( <Object>, <Name> )** | Sets the xref:/Labels_and_Captions.adoc[label] of given object to the given name. e.g. Let c: x^2 + 2y^2 = 2. Rename(c, "ell") sets the label to _ell_.
- **Repeat( <Number>, <Scripting Command>, <Scripting Command>, ... )** | Repeats the execution of scripting commands _n_ times, where _n_ is the given _Number_. e.g. Turtle(). Click the Play.png,width=16,height=16] "Play" button displayed at bott
- **RunClickScript( <Object> )** | Runs the click script associated with the Object (if it has one). e.g. Let _A_ and _B_ be points. The _OnClick_ script for _B_ is SetValue(B,(1,1)). Se
- **RunUpdateScript( <Object> )** | Runs the update script associated with the Object (if it has one).
- **SelectObjects(  | SelectObjects)** | Deselects all selected objects. e.g. * Let _A_, _B_ and _C_ be points. SelectObjects(A, B, C) selects points _A_, _B_
- **SetActiveView( <View> )** | Makes given xref:/Graphics_View.adoc[View] active. * 1 or "G" for image:16px-Menu_view_graphics.svg.png[Menu view graphi...
- **SetAxesRatio( <Number>, <Number>  | SetAxesRatio)** | Changes the axes ratio of active image:16px-Menu_view_graphics.svg.png[Menu view graphics.svg,width=16,height=16] xref:/... e.g. * SetAxesRatio(1,2) fixes the _x_-axis and compresses the _y_-axis * SetAxesRati
- **SetBackgroundColor( <Object>, <Red>, <Green>, <Blue>  | SetBackgroundColor)** | Changes the background color of given object. This is used for _Texts_ and for objects in the _Spreadsheet_. The red, gr... e.g. SetBackgroundColor(text1, "#80FF0000") sets the background color of existing _te
- **SetCaption( <Object>, <Text> )** | Changes the xref:/Labels_and_Captions.adoc[caption] of the given object. _Text_ must be enclosed in double quotes
- **SetColor( <Object>, <Red>, <Green>, <Blue>  | SetColor)** | Changes the color of given object. The red, green and blue represent amount of corresponding color component, 0 being mi... e.g. SetColor(text1, "#80FF0000") sets the color of existing _text1_ as red, with a 5
- **SetConditionToShowObject( <Object>, <Condition> )** | Sets the xref:/Conditional_Visibility.adoc[condition to show] given object.
- **SetCoords( <Object>, <x>, <y>  | SetCoords)** | Sets the cartesian coordinates of xref:/Free_Dependent_and_Auxiliary_Objects.adoc[free] objects in a 2D View as the give...
- **SetDecoration( <Object>, <Number>  | SetDecoration)** | Sets the decoration of the given object (see also the _Style_ tab in the _Properties_ window of the object). The object ...
- **SetDynamicColor( <Object>, <Red>, <Green>, <Blue>  | SetDynamicColor)** | Sets the xref:/Dynamic_Colors.adoc[dynamic color] of the object.
- **SetFilling( <Object>, <Number> )** | Changes the opacity of given object. Number must be from interval [0,1], where 0 means transparent and 1 means 100% opaq...
- **SetFixed( <Object>, <true | false>  | SetFixed)** | Makes the object xref:/Object_Properties.adoc[fixed] (for true) or not fixed (for false).
- **SetImage( <Object>, <Image>  | SetImage)** | Fills the given object with an image. e.g. SetImage(button1,"pause") shows the GeoGebra’s predefined Pause icon on button1.
- **SetLabelMode( <Object>, <Number> )** | Changes the label mode of the given object, according to the table below. |=== |Number |Mode |0 |Name |1 |Name + Value |...
- **SetLayer( <Object>, <Layer> )** | Sets the xref:/Layers.adoc[layer] for given object, where number of the layer must be an integer between 0 and 9 include...
- **SetLevelOfDetail( <Surface>, <Level of Detail> )** | Sets whether a surface is drawn quickly with less details (Level of Detail = 0) or slowly but more accurately (Level of ...
- **SetLineOpacity( <Object>, <Number> )** | Sets the line opacity for the given object to a number between 0 and 1.
- **SetLineStyle( <Line>, <Number> )** | Changes the line style of given object according to following table (numbers out of range [0,4] are treated as 0). |=== ...
- **SetLineThickness( <Object>, <Number> )** | Sets the line thickness for the given object to stem:[\frac{N}2] pixels, where _N_ is the given number.
- **SetPerspective( <Text> )** | Changes the layout and visibility of _Views_. The text parameter is either the full description of the layout, descripti... e.g. * SetPerspective("G") makes only the view graphics.svg,width=16,height=16] _Grap
- **SetPointSize( <Point>, <Number>  | SetPointSize)** | Changes the size of the given point to the given number.
- **SetPointStyle( <Point>, <Number> )** | Changes the point style of given point according to following table (numbers out of range [0,10] will be treated as 0). ...
- **SetSeed( <Integer> )** | Seeds the random number generator so that subsequent random numbers will be determined by the seed. e.g. SetSeed(33)
- **SetSpinSpeed( <Number> )** | Sets the rotational speed of image:16px-Perspectives_algebra_3Dgraphics.svg.png[Perspectives algebra 3Dgraphics.svg,widt...
- **SetTooltipMode( <Object>, <Number> )** | Changes the xref:/Tooltips.adoc[tooltip mode] for given object according to following table (values out of range [0,4] a...
- **SetTrace( <Object>, <true | false> )** | Turns xref:/Tracing.adoc[Tracing] on/off for the specified object. e.g. Create a point A, then type in SetTrace(A,true). Select the move.svg,width=22,he
- **SetValue( <Boolean>, <0|1>  | SetValue)** | Sets the state of a boolean / check box : 1 = true, 0 = false e.g. If _b_ is a boolean, SetValue(b,1) sets the boolean _b_ as _true_.
- **SetViewDirection( <Direction>  | SetViewDirection)** | Sets the direction of the 3D view orientation depending on the given object. e.g. * SetViewDirection(Vector((0, 0, 1))) * SetViewDirection((0, 0, 1)) * SetViewDir
- **SetVisibleInView( <Object>, <View Number 1|2|-1>, <Boolean> )** | Makes object xref:/Object_Properties.adoc[visible] or hidden in given image:16px-Menu_view_graphics.svg.png[Menu view gr...
- **ShowAxes(  | ShowAxes)** | Shows the axes in the active View. e.g. * ShowAxes(true) shows the axes in the active View. * ShowAxes(false) hides the 
- **ShowGrid(  | ShowGrid)** | Shows the grid in the active View. e.g. * ShowGrid(true) shows the grid in the active View. * ShowGrid(false) hides the 
- **ShowLabel( <Object>, <Boolean> )** | Shows or hides the label in the image:16px-Menu_view_graphics.svg.png[Menu view graphics.svg,width=16,height=16] xref:/G... e.g. Let f(x) = x^2. ShowLabel(f, true) shows the label of the function.
- **ShowLayer( <Number> )** | Makes all objects in given xref:/Layers.adoc[layer] xref:/Object_Properties.adoc[visible]. Does not override xref:/Condi... e.g. ShowLayer(2) makes all objects in the second layer visible.
- **Slider( <Min>, <Max>, <Increment>, <Speed>, <Width>,<Is Angle>, <Horizontal>, <Animating>, <Boolean Random>)** | Creates a xref:/tools/Slider.adoc[slider]. The parameters settings can be as follows: * _Min_, _Max_: set the range of t...
- **StartAnimation(  | StartAnimation)** | Resumes all animations if they are paused.
- **StartRecord(  | StartRecord)** | Resumes all recording to spreadsheet if paused (and stores a value for each object).
- **Turtle(...)** | Creates a turtle at the coordinate origin.
- **TurtleBack( <Turtle>, <Distance> )** | The turtle moves back with given distance. e.g. If the turtle is at the origin of the coordinates and the Pause.png,width=16,hei
- **TurtleDown( <Turtle> )** | Authorizes the turtle named to trace its movement from now.
- **TurtleForward( <Turtle>, <Distance> )** | The turtle moves forward with given distance. e.g. If the turtle is at the origin of the coordinates and the Pause.png,width=16,hei
- **TurtleLeft( <Turtle>, <Angle> )** | The turtle turns to the left by a given angle. e.g. TurtleLeft(turtle, 1) turns the turtle to the left by 1 rad, if Pause.png,width=
- **TurtleRight( <Turtle>, <Angle> )** | The turtle turns to the right by a given angle. e.g. TurtleRight(turtle, 1) turns the turtle to the right by 1 rad, if Pause.png,widt
- **TurtleUp( <Turtle> )** | Instructs the named turtle not trace its movement from now.
- **UpdateConstruction(  | UpdateConstruction)** | Recomputes all objects (random numbers are regenerated). Same as [.kcode]#F9# or [.kcode]#Ctrl# + [.kcode]#R#. e.g. UpdateConstruction(2) updates the construction twice (e.g. to record several dic
- **ZoomIn(  | ZoomIn)** | Restores the image:16px-Menu_view_graphics.svg.png[Menu view graphics.svg,width=16,height=16] xref:/Graphics_View.adoc[G... e.g. ZoomIn(1) doesn't change the view, but does remove traces ZoomIn(2) zooms the vi
- **ZoomOut( <Scale Factor>  | ZoomOut)** | Zooms the image:16px-Menu_view_graphics.svg.png[Menu view graphics.svg,width=16,height=16] xref:/Graphics_View.adoc[Grap... e.g. ZoomOut(2) zooms the view out.

## Conic Commands

- **Axes( <Conic>  | Axes)** | Returns the equations of the major and minor axes of a conic section. e.g. Axes(x^2 + y^2 + z^2= 3) returns the three lines _a_: _X_ = (0, 0, 0) + _λ_ (1, 
- **Center( <Conic>  | Center)** | Returns the center of a circle, ellipse, or hyperbola. e.g. Center(x^2 + 4 y^2 + 2x - 8y + 1 = 0) (], ]: Centre(x^2 + 4 y^2 + 2x - 8y + 1 = 
- **Conic( <Point>, <Point>, <Point>, <Point>, <Point>  | Conic)** | Returns a conic section through the five given points. e.g. Conic((0, -4), (2, 4), (3,1), (-2,3), (-3,-1)) yields _151x² - 37x y + 72y² + 14
- **ConjugateDiameter( <Line>, <Conic>  | ConjugateDiameter)** | Returns the https://en.wikipedia.org/wiki/Conjugate_diameters[conjugate diameter] of the diameter that is parallel to th... e.g. ConjugateDiameter(-4x + 5y = -2, x^2 + 4 y^2 + 2x - 8y + 1 = 0) yields line 5__x
- **Directrix( <Conic> )** | Yields the directrix of the conic. e.g. Directrix(x^2 - 3x + 3y = 9) yields the line _y_ = 4.5
- **Eccentricity( <Conic> )** | Calculates the eccentricity of the conic section. e.g. Eccentricity(x^2/9 + y^2/4 = 1) returns _a_ = 0.75
- **Ellipse( <Focus>, <Focus>, <Semimajor Axis Length>  | Ellipse)** | Creates an ellipse with two focal points and semimajor axis length. e.g. Ellipse((0, 1), (1, 1), 1) yields _12x² + 16y² - 12x - 32y = -7_.
- **Focus( <Conic> )** | Yields (all) foci of the conic section. e.g. Focus(4x^2 - y^2 + 16x + 20 = 0) returns the two foci of the given hyperbola: __
- **Hyperbola( <Focus>, <Focus>, <Semimajor Axis Length>  | Hyperbola)** | Creates a hyperbola with given focus points and semimajor axis length. e.g. Hyperbola((0, -4), (2, 4), 1) yields _-8xy - 15y² + 8y = -16_.
- **LinearEccentricity( <Conic> )** | Calculates the linear eccentricity of the conic section. For ellipses or hyperbolas the command gives the distance betwe... e.g. LinearEccentricity(4x^2 - y^2 + 16x + 20 = 0) returns 2.24
- **MajorAxis( <Conic> )** | Returns the equation of the major axis of the conic section. e.g. MajorAxis(x^2 / 9 + y^2 / 4 = 1) returns _y_ = 0.
- **MinorAxis( <Conic> )** | Returns the equation of the minor axis of the conic section. e.g. MinorAxis(x^2 / 9 + y^2 / 4 = 1) returns _x_ = 0.
- **Parabola( <Point>, <Line> )** | Returns a parabola with focal point and the line as directrix. e.g. Let a = Line\((0,1), (2,1)). Parabola((3, 3), a) yields _x² - 6x - 4y = -17_ .
- **Parameter( <Parabola> )** | Returns the parameter of the parabola, which is the distance between the directrix and the focus. e.g. Parameter(y = x^2 - 3x + 5) returns _0.5_.
- **Polar( <Point>, <Conic>  | Polar)** | Creates the polar line of the given point relative to the conic section. e.g. Polar((0,2), y = x^2 - 3x + 5) creates the line 1.5__x__ + 0.5__y__ = 4
- **SemiMajorAxisLength( <Conic> )** | Returns the length of the semimajor axis (half of the major axis) of the conic section. e.g. SemiMajorAxisLength((x - 1)^2 + (y - 2)^2 = 4) yields _2_.
- **SemiMinorAxisLength( <Conic> )** | Returns the length of the semiminor axis (half of the minor axis) of the conic section. e.g. SemiMinorAxisLength(x^2 + 2y^2 - 2x - 4y = 5) yields _2_.

## GeoGebra Commands

- **AxisStepX( )** | Returns the current step width for the _x_‐axis.
- **AxisStepY( )** | Returns the current step width for the _y_‐axis.
- **CASLoaded(...)** | Returns a boolean value: `true` if CAS commands were already loaded, `false` otherwise. The value is dynamic (changes to...
- **ConstructionStep( | ConstructionStep)** | Returns the current xref:/Construction_Protocol.adoc[Construction Protocol] step as a number.
- **Corner( <Number of Corner>  | Corner)** | For number _n = 1, 2, 3, 4_ creates a point at the corner of the image:16px-Menu_view_graphics.svg.png[Menu view graphic...
- **DynamicCoordinates( <Point>, <x-Coordinate>, <y-Coordinate>  | DynamicCoordinates)** | Creates a new point with given coordinates: this point is dependent, but can be moved. Whenever you try to move the new ... e.g. * Let _A_ be a point and B = DynamicCoordinates(A, round(x(A)), round(y(A))). Wh
- **Name( <Object> )** | Returns the name of an object as a text in the image:16px-Menu_view_graphics.svg.png[Menu view graphics.svg,width=16,hei...
- **Object( <Name of Object as Text> )** | Returns the object for a given name. The result is always a dependent object. e.g. If points _A1_, _A2_, ... , _A20_ exist and also a slider _n = 2_, then Object("
- **SetConstructionStep( <Number> )** | Changes the xref:/commands/ConstructionStep.adoc[construction step] to given value. You can use this command to create b...
- **SlowPlot( <Function>  | SlowPlot)** | Creates an animated graph of the given function, that is plotted from left to right. The animation is controlled by a xr...
- **ToolImage( <Number>  | ToolImage)** | Creates in the _Graphics View_ a 32x32 pixel image of the xref:en@reference::/Toolbar.adoc[tool icon] with given number.

## Chart Commands

- **BarChart( <List of Data>, <List of Frequencies>  | BarChart)** | Creates a bar chart using the list of data with corresponding frequencies. e.g. * BarChart({10, 11, 12, 13, 14}, {5, 8, 12, 0, 1}) * BarChart({5, 6, 7, 8, 9}, {
- **BoxPlot( yOffset, yScale, List of Raw Data  | BoxPlot)** | Creates a box plot using the given raw data and whose vertical position in the coordinate system is controlled by variab... e.g. BoxPlot(0, 1, {2, 2, 3, 4, 5, 5, 6, 7, 7, 8, 8, 8, 9})
- **DotPlot( <List of Raw Data>  | DotPlot)** | Returns a dot plot for the given list of numbers, as well as the list of the dot plot points. If a number _n_ appears in... e.g. DotPlot({2, 5, 3, 4, 3, 5, 3}) yields _{(2, 1), (3, 1), (3, 2), (3, 3), (4, 1), 
- **Histogram( <List of Class Boundaries>, <List of Heights>  | Histogram)** | Creates a histogram with bars of the given heights. The class boundaries determine the width and position of each bar of... e.g. Histogram({0, 1, 2, 3, 4, 5}, {2, 6, 8, 3, 1}) creates a histogram with 5 bars o
- **HistogramRight( <List of Class Boundaries>, <List of Heights>  | HistogramRight)** | Same as `++Histogram(<List of Class Boundaries>, <List of Heights>)++` (see xref:./Histogram.adoc[Histogram Command]).
- **LineGraph(<List of x-coordinates>, <List of y-coordinates>)** | Creates a chart, connecting with line segments the points whose coordinates are defined in the lists, to visualize given...
- **NormalQuantilePlot( <List of Raw Data> )** | Creates a normal quantile plot from the given list of data and draws a line through the points showing the ideal plot fo...
- **PieChart(< List of Frequencies > | PieChart)** | Creates a pie chart using a list of frequencies. The whole pie gives 100%, the provided data is shown as pie slices. e.g. PieChart({20, 15, 40, 5, 10, 20}) creates a pie chart with default center (0,0) 
- **ResidualPlot( <List of Points>, <Function> )** | Returns a list of points whose x-coordinates are equal to the x-coordinates of the elements of the given list, and y-coo... e.g. Let list = {(-1, 1), (-0.51, 2), (0, 0.61), (0.51, -1.41), (0.54, 1.97), (1.11, 
- **StemPlot( <List>  | StemPlot)** | Returns a stem plot of the given list of numbers. Outliers are removed from the plot and listed separately. An outlier i...
- **StepGraph( <List of Points>  | StepGraph)** | Draws a step graph of the given list of points. Each point is connected to the next point in the list by a horizontal li... e.g. StepGraph({(1, 1), (3, 2), (4, 5), (5, 7)})
- **StickGraph( <List of Points>  | StickGraph)** | Draws a stick graph of the given points. For each point a vertical line segment is drawn from the x-axis to the point. e.g. StickGraph({(1, 1), (3, 2), (4, 5), (5, 7)})

## Probability Commands

- **Bernoulli( <Probability p>, <Boolean Cumulative> )** | For _Cumulative = false_ returns the bar graph of https://en.wikipedia.org/wiki/Bernoulli_distribution[Bernoulli distrib...
- **BetaDist( <Number α>, <Number β>, <Variable value>  | BetaDist)** | Calculates the value of the cumulative distribution function of a https://en.wikipedia.org/wiki/Beta_distribution[Beta d...
- **BinomialDist( <Number of Trials>, <Probability of Success>  | BinomialDist)** | Returns a histogram of a https://en.wikipedia.org/wiki/Binomial_distribution[Binomial distribution]. The parameter _Numb...
- **Cauchy( <Median>, <Scale>, <Variable value>  | Cauchy)** | Calculates the value of the cumulative density function (cdf) at the given _variable value v_ of a https://en.wikipedia.... e.g. Cauchy(1, 2, 3) yields _0.75_ in the view algebra.svg,width=16,height=16] xref:/
- **ChiSquared( <Degrees of Freedom>, <Variable Value>  | ChiSquared)** | Calculates the value of the cumulative distribution function of a Chi squared distribution at _variable value_ _v_, i.e.... e.g. ChiSquared(4, 3) yields stem:[\gamma\left(2, \frac{3}{2}\right)], which is appro
- **Erlang( <Shape>, <Rate>, <Variable Value>  | Erlang)** | Calculates the value of cumulative distribution function of an https://en.wikipedia.org/wiki/Erlang_distribution[Erlang ...
- **Exponential( <Lambda>, <Variable Value>  | Exponential)** | Calculates the value of the cumulative distribution function of an Exponential distribution at _variable value v_, i.e. ...
- **FDistribution( <Numerator Degrees of Freedom>, <Denominator Degrees of Freedom>, <Variable Value>  | FDistribution)** | Calculates the value of the cumulative distribution function of an https://en.wikipedia.org/wiki/F-distribution[F-distri...
- **Gamma( <Alpha>, <Beta>, <Variable Value>  | Gamma)** | Calculates the value of the cumulative distribution function of a https://en.wikipedia.org/wiki/Gamma_distribution[Gamma...
- **HyperGeometric( <Population Size>, <Number of Successes>, <Sample Size> | HyperGeometric)** | Returns a https://en.wikipedia.org/wiki/Hypergeometric_distribution[Hypergeometric distribution] bar graph. e.g. Parameters: * _Population size_: number of balls in an urn * _Number of Successe
- **InverseBeta( <Number α>, <Number β>, <Probability> )** | Computes the inverse of the Beta cumulative distribution with parameters _α_ and _β_ for a given probability _p_. In oth...
- **InverseBinomial( <Number of Trials>, <Probability of Success>, <Cumulative Probability> )** | Returns least integer _n_ such that _P(X ≤ n) ≥ p_, where _p_ is the probability and _X_ is https://en.wikipedia.org/wik...
- **InverseBinomialMinimumTrials(Cumulative Probability, Probability of Success, Number of Successes)** | Returns the minimum number _n_ of trials to obtain the given number of successes. e.g. `InverseBinomialMinimumTrials(0.5, 0.2 ,50)` yields 254.
- **InverseCauchy( <Median>, <Scale>, <Probability> )** | Computes the inverse of the cumulative distribution function of a https://en.wikipedia.org/wiki/Cauchy_distribution[Cauc...
- **InverseChiSquared( <Degrees of Freedom>, <Probability> )** | Computes the inverse of the cumulative distribution function of a https://en.wikipedia.org/wiki/Chi-square_distribution[...
- **InverseExponential( <Lambda>, <Probability> )** | Computes the inverse of the cumulative distribution function of an https://en.wikipedia.org/wiki/Exponential_distributio...
- **InverseFDistribution( <Numerator Degrees of Freedom>, <Denominator Degrees of Freedom>, <Probability> )** | Computes the inverse of the cumulative distribution function of an https://en.wikipedia.org/wiki/F-distribution[F-distri...
- **InverseGamma( <Alpha>, <Beta>, <Probability> )** | Computes the inverse of the Gamma cumulative distribution with parameters _α_ and _β_ for a given probability _p_. In ot...
- **InverseHyperGeometric( <Population Size>, <Number of Successes>, <Sample Size>, <Probability> )** | Returns least integer _n_ such that _P(X ≤ n) ≥ p_, where _p_ is the probability and _X_ is https://en.wikipedia.org/wik...
- **InverseLogNormal( <Mean>, <Standard Deviation>, <Probability> )** | Computes the inverse of the cumulative distribution function of a https://en.wikipedia.org/wiki/Log-normal_distribution[... e.g. * InverseLogNormal(10, 20, 1/3) returns _3.997_. * InverseLogNormal(1000, 2, 1) 
- **InverseLogistic( <Mean>, <Scale>, <Probability> )** | Computes the inverse of the cumulative distribution function of a https://en.wikipedia.org/wiki/Logistic_distribution[Lo... e.g. InverseLogistic(100, 2, 1) yields _stem:[ \infty ]_.
- **InverseNormal( <Mean>, <Standard Deviation>, <Probability> )** | Evaluates the expression stem:[\Phi^{-1}(P) \cdot \sigma + \mu ] at given probability _P_, where stem:[\Phi^{-1}] is the... e.g. InverseNormal(50, 2, 0.9) yields 52.56, that is the 90th percentile of a normal 
- **InversePascal( <n>, <p>, <Probability> )** | Returns least integer _n_ such that _P(X≤n) ≥ p_, where p is the probability and _X_ is https://en.wikipedia.org/wiki/Ne...
- **InversePoisson( <Mean>, <Probability> )** | Returns the least integer _n_ such that _P(X≤n) ≥ p_, where _p_ is the given _probability_ and _X_ is a Poisson random v...
- **InverseTDistribution( <Degrees of Freedom>, <Probability> )** | Evaluates at _p_ the inverse of the cumulative distribution function of a https://en.wikipedia.org/wiki/T-distribution[t...
- **InverseWeibull( <Shape>, <Scale>, <Probability> )** | Evaluates the inverse of the cumulative distribution function of a https://en.wikipedia.org/wiki/Weibull_distribution[We...
- **InverseZipf( <Number of Elements>, <Exponent>, <Probability> )** | Returns the least integer _n_ such that _P(X≤n) ≥ p_, where X is a https://en.wikipedia.org/wiki/Zipf_distribution[Zipf ...
- **LogNormal( <Mean>, <Standard Deviation>, <Variable Value>  | LogNormal)** | Evaluates the cumulative distribution function of a log-normal distribution at _variable value_, i.e. calculates the pro...
- **Logistic( <Mean>, <Scale>, <Variable Value>  | Logistic)** | Evaluates the cumulative distribution function of a https://en.wikipedia.org/wiki/Logistic_distribution[logistic distrib...
- **Normal( <Mean>, <Standard Deviation>, <Variable Value>  | Normal)** | Evaluates the function stem:[\Phi \left(\frac{x- \mu}{\sigma} \right) ] at _variable value v_, where _Φ_ is the cumulati... e.g. Normal(2, 0.5, 1) yields _0.02_ in the ] xref:/Algebra_View.adoc[Algebra View] a
- **Pascal( <n>, <p>  | Pascal)** | Returns a bar graph of a https://en.wikipedia.org/wiki/Negative_binomial_distribution[Pascal distribution]. The Pascal d... e.g. If the number of independent Bernoulli trials that must be successful is n = 1, 
- **Poisson( <Mean>  | Poisson)** | Returns a bar graph of a https://en.wikipedia.org/wiki/Poisson_distribution[Poisson distribution] with given mean _λ_. e.g. * Poisson(3, 1, true) yields _0.2_ in the view algebra.svg,width=16,height=16] _
- **RandomBetween( <Minimum Integer> , <Maximum Integer>  | RandomBetween)** | Generates a random integer between _minimum_ and _maximum_ (inclusive). e.g. RandomBetween(0, 10) yields a number between _0_ and _10_ (inclusive)
- **RandomBinomial( <Number of Trials>, <Probability> )** | Generates a random number from a binomial distribution with _n_ trials and probability _p_. e.g. RandomBinomial(3, 0.1) gives _j ∈ {0, 1, 2, 3}_, where the probability of gettin
- **RandomDiscrete( <List>, <List> )** | Returns a random number from the first list according to the (relative) probability distribution defined in the second l...
- **RandomNormal( <Mean>, <Standard Deviation> )** | Generates a random number from a normal distribution with given mean and standard deviation. e.g. RandomNormal(3, 0.1) yields a random value from a normal distribution with a mea
- **RandomPointIn( <Region>  | RandomPointIn)** | Creates a random point inside a given polygon or closed conic. e.g. RandomPointIn(Polygon(A,B,C)) and RandomPointIn(A,B,C) both give random point in
- **RandomPoisson( <Mean> )** | Generates a random number from a Poisson distribution with given mean. e.g. RandomPoisson(3) yields a random value from a Poisson distribution with a mean o
- **RandomPolynomial( <Degree> , <Minimum for Coefficients>, <Maximum for Coefficients>  | RandomPolynomial)** | Returns a randomly generated polynomial in _x_ of degree _d_, whose (integer) coefficients are in the range from _minimu... e.g. * RandomPolynomial(0, 1, 2) yields either _1_ or _2_. * RandomPolynomial(2, 1, 2
- **RandomUniform( <Min>, <Max>  | RandomUniform)** | Returns random real number from https://en.wikipedia.org/wiki/Uniform_distribution_(continuous)[uniform distribution] on... e.g. RandomUniform(0, 1) returns a random number between _0_ and _1_
- **TDistribution( <Degrees of Freedom>, <Variable Value>  | TDistribution)** | Evaluates the cumulative distribution function of a t-distribution at _variable value v_, i.e. calculates the probabilit... e.g. TDistribution(10, 0) yields _0.5_.
- **Triangular( <Lower Bound>, <Upper Bound>, <Mode>, <Variable Value>  | Triangular)** | Evaluates the cumulative distribution function of a triangular distribution at _variable value v_, i.e. calculates the p... e.g. Triangular(0, 5, 2, 2) yields _0.4_.
- **Uniform( <Lower Bound>, <Upper Bound>, <Variable Value>  | Uniform)** | Evaluates the cumulative distribution function of a uniform distribution at _variable value v_, i.e. calculates the prob...
- **Weibull( <Shape>, <Scale>, <Variable Value>  | Weibull)** | Evaluates the cumulative distribution function of a Weibull distribution at _variable value v_, i.e. calculates the prob... e.g. * Weibull(0.5, 1, 0) yields _0_. * Weibull(0.5, 1, 1) yields _stem:[1 - \frac{1}
- **Zipf( <Number of Elements>, <Exponent>  | Zipf)** | Returns a bar graph of a https://en.wikipedia.org/wiki/Zipf%27s_law[Zipf distribution]. Parameters: _Number of Elements_... e.g. Zipf(10, 1 , 5, false) yields _0.07_ in the view algebra.svg,width=16,height=16]

## 3D Commands

- **Bottom( <Quadric> )** | Creates the bottom of the limited quadric. e.g. Bottom(cylinder) yields a circle.
- **Cone( <Circle>, <Height>  | Cone)** | Creates a cone with given base and height.
- **Cube( <Square>  | Cube)** | Creates a cube having as base the given square.
- **Cylinder( <Circle>, <Height>  | Cylinder)** | Creates a cylinder with given base and given height.
- **Dodecahedron( <Regular pentagon>  | Dodecahedron)** | Creates a dodecahedron having the given regular pentagon as base.
- **Ends( <Quadric> )** | Creates the top and the bottom of the limited quadric. e.g. * Ends( cylinder ) yields two circles. * Ends( cone ) yields a circle and the co
- **Height( <Solid> )** | Calculates the "oriented" height of the given solid. e.g. * Height( <Cone> ) calculates the "oriented" height of the given cone. * Height(
- **Icosahedron( <Equilateral Triangle>  | Icosahedron)** | Creates an icosahedron having as base the given equilateral triangle.
- **InfiniteCone( <Point>, <Vector>, <Angle α>  | InfiniteCone)** | Creates an infinite cone with given point as vertex, axis of symmetry parallel to the given vector and apex angle _2α_.
- **InfiniteCylinder( <Line>, <Radius>  | InfiniteCylinder)** | Creates an infinite cylinder with given radius and given line as an axis of symmetry. e.g. InfiniteCylinder( xAxis, 2 ) creates an infinite cylinder with radius 2 and with
- **IntersectConic( <Plane>, <Quadric>  | IntersectConic)** | Intersects the plane with the quadric. e.g. IntersectConic(sphere1, sphere2) creates the intersection conic of two spheres.
- **Net( <Polyhedron> , <Number>  | Net)** | Creates the net of a convex polyhedron, on the plane containing the face used for its construction. The number is used t...
- **Octahedron( <Equilateral Triangle>  | Octahedron)** | Creates an octahedron having as base the given equilateral triangle.
- **PerpendicularPlane( <Point>, <Line>  | PerpendicularPlane)** | Creates a plane through the given point, perpendicular to the given line.
- **Plane( <Polygon>  | Plane)** | Creates the plane containing the given polygon.
- **PlaneBisector( <Point> , <Point>  | PlaneBisector)** | Creates the plane orthogonal bisector between the two points.
- **Prism( <Point>, <Point>, ...  | Prism)** | Returns a prism defined by the given points. e.g. Prism(A, B, C, D) creates the prism with base ABC and top DEF. The vectors AD, B
- **Pyramid( <Point>, <Point>, ... | Pyramid)** | Returns a pyramid defined by the given points. e.g. Pyramid(A, B, C, D) creates the pyramid with base _ABC_ and apex _D_.
- **Side( <Quadric> )** | Creates the side of the limited quadric. e.g. Side( cylinder ) creates the curved surface area of the cylinder.
- **Sphere( <Point>, <Radius>  | Sphere)** | Creates a sphere with center and radius. e.g. Sphere((0, 0, 0), (1, 1, 1)) yields _x² + y² + z² = 3_
- **Surface( <Expression>, <Expression>, <Expression>, <Parameter Variable 1>, <Start Value>, <End Value>, <Parameter Variable 2>, <Start Value>, <End Value>  | Surface)** | Yields the Cartesian parametric 3D surface for the given _x_-expression (first _<Expression>_), _y_-expression (second _... e.g. Let _r_ and _R_ be two positive real numbers: Surface((R + r cos( u)) cos(v) , (
- **Tetrahedron( <Equilateral Triangle>  | Tetrahedron)** | Creates a tetrahedron having as base the given equilateral triangle.
- **Top( <Quadric> )** | Creates the top of the limited quadric. e.g. * Top( cylinder ) yields a circle. * Top( cone ) yields the cone end (point).
- **Volume( <Solid> )** | Calculates the volume of the given solid. e.g. * Volume( <Pyramid> ) calculates the volume of the given pyramid. * Volume( <Pri

## Spreadsheet Commands

- **Cell( <Column>, <Row> )** | Returns copy of xref:/Spreadsheet_View.adoc[spreadsheet] cell in given column and row. e.g. Cell(2, 1) returns copy of B1.
- **CellRange( <Start Cell>, <End Cell> )** | Creates a list containing the cell values in this cell range. e.g. Let A1 = 1, A2 = 4, A3 = 9 be xref:/Spreadsheet_View.adoc[spreadsheet] cells val
- **Column( <Spreadsheet Cell> )** | Returns the column of the cell as a number (starting at 1). e.g. q = Column(B3) returns _q = 2_ since column _B_ is the second column of the xref
- **ColumnName( <Spreadsheet Cell> )** | Returns the column name of the cell as a text. e.g. r = ColumnName(A1) creates _r = A_ and shows such text - A - in the view graphic
- **FillCells( <CellRange>, <Object>  | FillCells)** | Copies the value/equation etc. of the object to the given cellrange. Resulting cells are xref:/Free_Dependent_and_Auxili...
- **FillColumn( <Column>, <List> )** | Copies values from the list to the first cells of the column given by number (1 for A, 2 for B, etc.). Resulting cells a...
- **FillRow( <Row>, <List> )** | Copies values from the list to the first cells of the row given by number. Resulting cells are free objects, i.e. indepe...
- **Row( <Spreadsheet Cell> )** | Returns the row number of the xref:/Spreadsheet_View.adoc[spreadsheet] cell (starting at 1). e.g. r = Row(B3) yields _r = 3_.

## Text Commands

- **ContingencyTable( <List of Text>, <List of Text>  | ContingencyTable)** | Draws a https://en.wikipedia.org/wiki/Contingency_table[Contingency Table] created from the two given lists. Unique valu... e.g. ContingencyTable({"Males","Females"},{"Right-handed", "Left-handed"},{{43,9},{44
- **ContinuedFraction( <Number>  | ContinuedFraction)** | Creates the https://en.wikipedia.org/wiki/Continued_fraction[continued fraction] approximating a given number. The resul... e.g. ContinuedFraction(5.45) gives _stem:[5 + \frac{1}{ 2+ \frac{1}{4+ \frac{1}{ 1+ \
- **First( <List>  | First)** | Gives a new list that contains the first element of the given list. e.g. First({1, 4, 3}) yields _{1}_.
- **FormulaText( <Object>  | FormulaText)** | Returns the formula that defines the object as a LaTeX text. Values are substituted for variables by default. e.g. Let _a = 2_ and _f(x) = a x^2^_. FormulaText(f) returns _2 x^2^_ (as a LaTeX tex
- **FractionText( <Number>  | FractionText)** | Creates and shows in the image:16px-Menu_view_graphics.svg.png[Menu view graphics.svg,width=16,height=16] xref:/Graphics... e.g. Given line _a: y = 1.5 x + 2_, FractionText(Slope(a)) creates the LaTeX text ste
- **FrequencyTable( <List of Raw Data>  | FrequencyTable)** | Returns a table (as text) whose first column contains sorted list of unique elements of list _L_ and second column conta...
- **IndexOf( <Object>, <List>  | IndexOf)** | Returns position of first occurrence of Object in List. e.g. IndexOf(5, {1, 3, 5, 2, 5, 4}) returns _3_.
- **Last( <List>  | Last)** | Gives a new list that contains the last element of the initial list. e.g. Last({1, 4, 3}) yields _{3}_.
- **LetterToUnicode( "<Letter>" )** | Converts a single letter into the corresponding https://en.wikipedia.org/wiki/Unicode[Unicode number]. e.g. LetterToUnicode("a") returns the number 97.
- **Ordinal( <Integer> )** | Turns a number into an ordinal (as a text). e.g. Ordinal(5) returns "5th".
- **ParseToFunction( <Text>  | ParseToFunction)** | Parses the text containing the function definition and creates the corresponding xref:/Functions.adoc[function]. e.g. * ParseToFunction("x^2") creates the function _f_(_x_) = __x__^2^_._ * ParseToFu
- **ParseToNumber( <Number>, <Text>  | ParseToNumber)** | Parses the text and stores the result to a xref:/Numbers_and_Angles.adoc[number] _a_, which must be defined and xref:/Fr... e.g. Define a = 3 and text1 = "6". ParseToNumber(a, text1) returns _a = 6_.
- **ReadText( <Text> )** | Tells the screen reader to read given text immediately.
- **ReplaceAll( <Text>, <Text to Match>, <Text to Replace> )** | Creates a new text containing the given _text_ whose _text to match_ has been replaced with the given _text to replace_. e.g. ReplaceAll("3cos(t)+cos(2y)", "cos", "sin") creates the new text "3sin(t)+sin(2y
- **RotateText( <Text>, <Angle> )** | Creates a new xref:/LaTeX.adoc[LaTeX] text, rotated by the given angle. e.g. * RotateText("a = 5", 45°) * If you want to place the text "GeoGebra", rotated b
- **ScientificText( <Number>  | ScientificText)** | Creates a text displaying the given number in https://en.wikipedia.org/wiki/Scientific_notation[scientific notation]. e.g. ScientificText(0.002) gives _2 × 10^-3^._
- **Simplify( <Function>  | Simplify)** | Simplifies the terms of the given function, if possible. e.g. Simplify(x + x + x) yields the function _f(x) = 3x_.
- **Split( <Text>, <List of Texts to split on>)** | Creates the list of texts obtained by splitting the given text at the given separators (not included in the list). e.g. Split("3cos(t)cos(2y)", {"cos"}) returns {"3", "(t)", "(2y)"}.
- **SurdText( <Point>  | SurdText)** | Creates a text representation of the point, with coordinates in the form stem:[\frac{a+b\sqrt{c}}{d}]. e.g. SurdText((2.414213562373095, 1.414213562373095)) creates the text _(stem:[1 + \s
- **TableText( <List>, <List>, ...  | TableText)** | Creates a text that contains a table of the list objects. e.g. * TableText({x^2, 4}, {x^3, 8}, {x^4, 16}) creates a table as a text object with
- **Take( <List>, <Start Position>  | Take)** | Returns a list containing the elements from _Start Position_ to the end of the initial list. e.g. Take({2, 4, 3, 7, 4}, 3) yields _{3, 7, 4}_.
- **Text( <Object>  | Text)** | Creates a xref:/Texts.adoc[text] containing the formula of the given object. e.g. If _a = 2_ and _c = a^2^_, then Text(c) creates the text _"4"_.
- **TextToUnicode( "<Text>" )** | Turns the text into a list of Unicode numbers, one for each character. e.g. * TextToUnicode("Some text") gives you the list of Unicode numbers _{83, 111, 10
- **UnicodeToLetter( <Integer> )** | Converts the integer Unicode number back into a letter which is displayed as a text object in the image:16px-Menu_view_g... e.g. UnicodeToLetter(97) yields the text _"a"_.
- **UnicodeToText( <List of Integers> )** | Converts the integer Unicode numbers back into text. e.g. UnicodeToText({104, 101, 108, 108, 111}) yields the text _"hello"_.
- **VerticalText( <Text>  | VerticalText)** | Creates a xref:/LaTeX.adoc[LaTeX] xref:/Texts.adoc[text], containing the given text rotated 90° counter-clockwise. e.g. * VerticalText("a = 5") creates the LaTeX text "_a_ = 5" displayed vertically, w

## Discrete Math Commands

- **ConvexHull( <List of Points> )** | Creates https://en.wikipedia.org/wiki/convex_hull[convex hull] of given set of points. Returned object is a xref:/comman...
- **DelaunayTriangulation( <List of Points> )** | Creates a https://en.wikipedia.org/wiki/Delaunay_Triangulation[Delaunay Triangulation] of the list of points. Returned o...
- **MinimumSpanningTree( <List of Points> )** | Returns the minimum spanning tree of a complete graph on given vertices in which weight of edge _(u,v)_ is the Euclidian...
- **ShortestDistance( <List of Segments>, <Start Point>, <End Point>, <Boolean Weighted> )** | Finds shortest path between start point and endpoint in a https://en.wikipedia.org/wiki/Graph_(mathematics)[graph] given...
- **TravelingSalesman( <List of Points> )** | Returns the shortest closed path which goes through each point exactly once. Returned object is a xref:/commands/Locus.a...
- **Voronoi( <List of Points> )** | Draws the https://en.wikipedia.org/wiki/Voronoi_diagram[Voronoi diagram] for given list of points. Returned object is a ...

## Logic Commands

- **CountIf( <Condition>, <List>  | CountIf)** | Counts the number of elements in the list satisfying the condition. e.g. * CountIf(x < 3, {1, 2, 3, 4, 5}) gives you the number _2_. * CountIf(x < 3, A1:
- **If( <Condition>, <Then>  | If)** | Yields a copy of the object _Then_ if the condition evaluates to _true_, and an undefined object if it evaluates to _fal... e.g. * Let _n_ = 3. If(n==3, x + y = 4) yields line _x_ + _y_ = 4, because the condit
- **IsDefined( <Object> )** | Returns _true_ or _false_ depending on whether the object is defined or not. e.g. IsDefined(Circle((1,1), -2)) returns _false_.
- **IsFactored( <Polynomial> )** | Returns ''true'' if the polynomial is factored in stem:[\mathbb Q] and ''false'' otherwise. In general, in order to cons... e.g. * `IsFactored(x)` yields _true_ + * `IsFactored(0.5)` yields _true_ + * `IsFacto
- **IsInRegion( <Point>, <Region> )** | Returns _true_ if the point is in given xref:/Geometric_Objects.adoc[region] and _false_ otherwise. e.g. IsInRegion((1,2), Polygon((0,0), (2,0), (1,3))) returns _true_.
- **IsInteger( <Number> )** | Returns _true_ or _false_ depending whether the number is an integer or not. e.g. IsInteger(972 / 9) returns _true_.
- **IsPrime( <Number>  | IsPrime)** | Gives _true_ or _false_ depending on whether the number is prime or not. == CAS Syntax e.g. * IsPrime(10) yields _false_, * IsPrime(11) yields _true_.
- **IsTangent( <Line>, <Conic> )** | Decides if the line is tangent to the conic. Normally this command computes the result numerically. This behavior can be... e.g. IsTangent(Line((0,0),(1,0)),Circle((0,1),1)) yields _true_.
- **IsVertexForm(<function>)** | Checks if a function is written in vertex form. e.g. IsVertexForm((x+2/3)^2-(2/3)^2) yields _true_
- **KeepIf( <Condition>, <List>  | KeepIf)** | Creates a new list that only contains those elements of the initial list that fulfil the condition. e.g. KeepIf(x<3, {1, 2, 3, 4, 1, 5, 6}) returns the new list _{1, 2, 1}_.
- **Relation( <List>  | Relation)** | Shows a message box that gives you information about the relation between two or more (up to 4) objects.

## Transformation Commands

- **Dilate( <Object>, <Dilation Factor>  | Dilate)** | Dilates the object from a point of origin using the given factor.
- **Reflect( <xref:/Geometric_Objects.adoc[Object]>, <Point>  | Reflect)** | Reflects the geometric object through a given point.
- **Rotate( <Object>, <Angle>  | Rotate)** | Rotates the xref:/Geometric_Objects.adoc[geometric object] by the angle around the axis origin.
- **Shear( <Object>, <Line>, <Ratio> )** | Shears the object so that * points on the line stay fixed. * points at distance _d_ from the line are shifted by _d stem...
- **Stretch( <xref:/Geometric_Objects.adoc[Object]>, <Vector>  | Stretch)** | The object is stretched *parallel* to the given vector by the ratio given by the *magnitude* of the vector (i.e. points ...
- **Translate( <Object>, <Vector>  | Translate)** | Translates the xref:/Geometric_Objects.adoc[geometric object] by the vector.

## Algebra Commands

- **FromBase( "<Number as Text>", <Base> )** | Converts given number from given https://en.wikipedia.org/wiki/Radix[base] into decimal base. The base must be between 2... e.g. * FromBase("FF", 16) returns 255. * FromBase("100000000", 2) returns 256.
- **ToBase( <Number>, <Base> )** | Converts given number into different https://en.wikipedia.org/wiki/Radix[base]. The base must be between _2_ and _36_. T... e.g. * ToBase(255,16) returns "FF". * ToBase(256, 2) returns "100000000".

## Financial Commands

- **FutureValue( <Rate>, <Number of Periods>, <Payment>, <Present Value )** | Returns the future value of an investment based on periodic, constant payments and a constant interest rate. * *<Rate>* ... e.g. FutureValue(10%/12, 15, -200, 0, 1) yields a future value of 3207.99.
- **Payment( <Rate>, <Number of Periods>, <Present Value>, <Future Value )** | Calculates the payment for a loan based on constant payments and a constant interest rate. * *<Rate>* Interest rate per ... e.g. Payment(6%/12, 10, 10000, 0,1) yields a monthly payment for a loan of -1022.59.
- **Periods( <Rate>, <Payment>, <Present Value>, <Future Value )** | Returns the number of periods for an annuity based on periodic, fixed payments and a fixed interest rate. * *<Rate>* Int... e.g. Periods(10%/12, -200, -400, 10000) yields a number of payments of 39.98. Periods
- **PresentValue( <Rate>, <Number of Periods>, <Payment>, <Future Value )** | Returns the total amount of payments of an investment. * *<Rate>* Interest rate per period. * *<Number of Periods>* Tota... e.g. PresentValue(12%/12, 4*12, -100, 5000, 0) yields a present value of 696.06. Pres
- **Rate( <Number of Periods>, <Payment>, <Present Value>, <Future Value )** | Returns the interest rate per period of an annuity. * *<Number of Periods>* Total number of payments for the loan. * *<P... e.g. Rate(5*12, -300, 10000) yields a monthly rate of 0.02 (2%).

## Optimization Commands

- **Maximize( <Dependent number>, <Free number>  | Maximize)** | Calculates the free number which gives the maximal value of the dependent number. The free number must be a slider and t... e.g. Let _a_ be a slider in [0,10] and _t1_ the right triangle with vertices _C_=(_a_
- **Minimize( <Dependent number>, <Free number>  | Minimize)** | Calculates the free number which gives the minimal value of the dependent number. The free number must be a slider and t... e.g. Let _a_ be a slider in [0,10] and _t1_ the right triangle with vertices _C_ = (_

